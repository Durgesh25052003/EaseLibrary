import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import Email from "../utils/Email.js"; // Remove the curly braces
import bcrypt from "bcryptjs";

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
    const user = await UserModel.findByIdAndUpdate(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const resetLink = `http://localhost:5173/reset-password/${bcrypt.hash(
      email,
      salt
    )}`;
    const sendForgetPasswordReset = new Email();
    sendForgetPasswordReset.sendMailForgetPassword(
      email,
      "pasword-reset",
      resetLink
    );
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
  } catch (error) {}
};
