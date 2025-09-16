import express from "express";
import {
  registerUser,
  loginUser,
  protect,
  forgetPassword,
  resetPassword,
} from "../Controllers/AuthController.js";
import {
  borrowBooks,
  returnBooks,
  getBorrowedBooks,
  getAllUsers,
  getAllBorrowedBooks,
  addFavorite,
  removeFavorite,
  getFavorites,
  getUserById,
  verifyBorrowCode,
  updateUserProfile,
  addHistory,
  getHistory,
} from "../Controllers/UserController.js";
import upload from "../utils/multer.js";

const UserRouter = express.Router();

// Routes
UserRouter.post("/signup", upload.single("profilePic"), registerUser);
UserRouter.post("/login", loginUser);
UserRouter.patch("/forgot-password", forgetPassword);
UserRouter.patch("/reset-password/:token", resetPassword);

UserRouter.post("/borrowBook", protect, borrowBooks);
UserRouter.post("/returnBook", returnBooks);
UserRouter.get("/getBorrowedBooks/:id", protect, getBorrowedBooks);
UserRouter.get("/getUser/:id", protect, getUserById);
UserRouter.get("/getAllUsers", protect, getAllUsers);
UserRouter.get("/getBorrowedBooks", protect, getAllBorrowedBooks);

UserRouter.post("/addFavorite", protect, addFavorite);
UserRouter.post("/removeFavorite", protect, removeFavorite);
UserRouter.get("/getFavorites", protect, getFavorites);
UserRouter.post("/addHistory",protect,addHistory)
UserRouter.get("/getHistory",protect,getHistory)

// Profile management routes

UserRouter.patch(
  "/profile",
  protect,
  upload.single("profilePic"),
  updateUserProfile
);

// Add this route with the other user routes
UserRouter.post("/verifyBorrowCode", verifyBorrowCode);

export default UserRouter;
