import cron from 'node-cron';
import UserModel from '../Models/UserModel.js';
import Email from '../utils/Email.js';
import { borrowBooks } from '../Controllers/UserController.js';

function startDailyRemainder(){

cron.schedule('0 9 * * *', () => {

    const today = new Date();
    const tommorow = new Date();
    tommorow.setDate(today.setDate()+1);

    const borrowedBooks = borrowBooks.find({
        returnDate:{
            $gte:today,
            $lt:tommorow        }
    }).populate('book').populate('user');
     
    for(const Book in borrowedBooks){

        const user = UserModel.findById(Book.user._id);

        if(user){
            Email.sendDailyRemainderEmail(user.email,'Daily Remainder',Book,user)
        }
    }
 

})

}

export {startDailyRemainder}