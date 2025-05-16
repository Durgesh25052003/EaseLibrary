import express from 'express';
import { registerUser , loginUser,protect, forgetPassword} from '../Controllers/AuthController.js';
import { borrowBooks, returnBooks, getBorrowedBooks,getAllUsers } from '../Controllers/UserController.js';
import upload from '../utils/multer.js';

const UserRouter = express.Router();

// Routes
UserRouter.post('/signup',upload.single("profilePic"),registerUser);
UserRouter.post('/login',loginUser);
UserRouter.get('/forget-password',forgetPassword)


UserRouter.post('/borrowBook',protect,borrowBooks)
UserRouter.post('/returnBook',protect,returnBooks)
UserRouter.get('/getBorrowedBooks/:id',protect,getBorrowedBooks)
UserRouter.get('/getAllUsers',protect,getAllUsers)

export default UserRouter;