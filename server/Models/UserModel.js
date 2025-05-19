import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      }
    ],
    borrowedBooksCount:{
      type:Number,
      default:0,
    },
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
  const password = this.password;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
