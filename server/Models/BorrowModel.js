import mongoose from "mongoose";

const BorrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  bookTitle: { type: String, required: true },
  bookAuthor: { type: String, required: true },
  userName: { type: String, required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date }, // auto-calculate
  days: { type: Number, required: true }, // user picks how many days
  amountPaid: { type: Number, required: true },
  isReturned: { type: Boolean, default: false },
  status: {
    type: String,
    default: "pending",
  },
  borrowCode: {
    type: Number,
    unique: true,
  },
});

const BorrowModel = mongoose.model("Borrow", BorrowSchema);

// Function to generate a unique borrow code
BorrowSchema.pre("save", function (next) {
  if (!this.borrowCode) {
    // Only generate if not already set
    this.borrowCode = Math.floor(100000 + Math.random() * 900000);
  }
  console.log("🌟🌟🌟 Borrow Code:", this.borrowCode);
  next();
});

export default BorrowModel;
