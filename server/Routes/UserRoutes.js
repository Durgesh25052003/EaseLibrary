import express from 'express';
import { registerUser , loginUser,protect, forgetPassword, resetPassword} from '../Controllers/AuthController.js';
import { borrowBooks, returnBooks, getBorrowedBooks,getAllUsers, getAllBorrowedBooks } from '../Controllers/UserController.js';
import upload from '../utils/multer.js';

const UserRouter = express.Router();

// Routes
UserRouter.post('/signup',upload.single("profilePic"),registerUser);
UserRouter.post('/login',loginUser);
UserRouter.patch('/forgot-password',forgetPassword)
UserRouter.patch('/reset-password/:token',resetPassword)



UserRouter.post('/borrowBook',protect,borrowBooks)
UserRouter.post('/returnBook',protect,returnBooks)
UserRouter.get('/getBorrowedBooks/:id',protect,getBorrowedBooks)
UserRouter.get('/getAllUsers',protect,getAllUsers)
UserRouter.get('/getBorrowedBooks',protect,getAllBorrowedBooks)

export default UserRouter;