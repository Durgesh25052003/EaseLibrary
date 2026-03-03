import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    isLoggedIn: {
      type: String,
      default: "false",
    },
    isVerified: {
      type: String,
      default:"false"
    },
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    borrowedBooksCount: {
      type: Number,
      default: 0,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dqj0xg1zv/image/upload/v1698236482/BookStore/defaultProfilePic.png",
    },
    token: {
      type: String,
    },
    history: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        accessedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// userSchema.pre(/^find/,function(next){
//   this.populate("borrowedBooks")
//   next()
// })

userSchema.pre("save", async function (next) {
  // Only hash when a password exists and has been modified
  if (!this.isModified("password") || !this.password) {
    this.confirmPassword = undefined;
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
