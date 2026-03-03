import express from "express";
import {
  registerUser,
  loginUser,
  protect,
  forgetPassword,
  resetPassword,
  googleCallback,
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
import passport from "passport";

const UserRouter = express.Router();

// Routes
//Step 1 Redriect to Google for authentication
UserRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
//Step 2 Google will redirect to our callback URL
UserRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback
);
UserRouter.post("/signup", upload.single("profilePic"), registerUser);
UserRouter.post("/login", loginUser);
UserRouter.patch("/forgot-password", forgetPassword);
UserRouter.patch("/reset-password/:token", resetPassword);
UserRouter.get("/me",protect,(req,res)=>{
  res.json({
    message:"success",
    user:req.user
  })
}
)

UserRouter.post("/borrowBook", protect, borrowBooks);
UserRouter.post("/returnBook", returnBooks);
UserRouter.get("/getBorrowedBooks/:id", protect, getBorrowedBooks);
UserRouter.get("/getUser/:id", protect, getUserById);
UserRouter.get("/getAllUsers", protect, getAllUsers);
UserRouter.get("/getBorrowedBooks", protect, getAllBorrowedBooks);

UserRouter.post("/addFavorite", protect, addFavorite);
UserRouter.post("/removeFavorite", protect, removeFavorite);
UserRouter.get("/getFavorites", protect, getFavorites);
UserRouter.post("/addHistory", protect, addHistory);
UserRouter.get("/getHistory", protect, getHistory);

// Profile management routes

UserRouter.patch(
  "/profile",
  protect,
  upload.single("profilePic"),
  updateUserProfile
);

UserRouter.post("/verifyBorrowCode", protect, verifyBorrowCode);

export default UserRouter;
