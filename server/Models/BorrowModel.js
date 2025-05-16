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
});

const BorrowModel = mongoose.model("Borrow", BorrowSchema);

export default BorrowModel;