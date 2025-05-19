import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import Email from "../../server/utils/Email.js"; // Remove the curly braces
import bcrypt from "bcryptjs";
import { useReducer } from "react";

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "90d",
    }
  );
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const profilePic = req.file.path;

    console.log(req.body);
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }
    const user = await UserModel.create({
      name,
      email,
      password,
      confirmPassword,
      profilePic,
    });

    // Sending welcome email
    const emailService = new Email();
    await emailService.sendMailWelcome(
      user.email,
      "Welcome to Library Management System",
      user.name,
      user.email,
      password,
      `${process.env.FRONTEND_URL}/login`
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (!user.comparePassword(password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = createToken(user);
    user.password = undefined;
    user.confirmPassword = undefined;
    console.log(token);
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await UserModel.findById(decoded.id).select(
      "-password -confirmPassword"
    );
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
    req.user.password = undefined;
    req.user.confirmPassword = undefined;
    // res.status(200).json({
    //   success: true,
    //   message: "User authenticated successfully",
    //   user: req.user,
    // });
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedEmail = await bcrypt.hash("EncyrptedToken", salt);
    // Encode the token for URL safety
    const encodedToken = encodeURIComponent(hashedEmail);
    const resetLink = `http://localhost:5173/reset-password/${encodedToken}`;
    
    const sendForgetPasswordReset = new Email();
    await sendForgetPasswordReset.sendMailForgetPassword(
      email,
      "password-reset",
      user.name,
      resetLink
    );

    user.token = hashedEmail;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    // Decode the token
    const decodedToken = decodeURIComponent(token);
    const user = await UserModel.findOne({ token: decodedToken });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found", 
      }) 
    }
    const { password } = req.body
    
    user.password = password;
    console.log(password,"password");
  
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {}
};
