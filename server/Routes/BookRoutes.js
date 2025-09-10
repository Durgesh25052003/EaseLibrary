import express from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../Controllers/BookController.js";
import upload from "../utils/multer.js";
import ReviewModel from "../Models/ReviewModel.js";

const BookRouter = express.Router();
const ReviewRouter= express.Router();

// Example route for getting all books
BookRouter.get("/getAllBooks", getAllBooks);
BookRouter.get("/getBookById/:id", getBookById);

// Example route for adding a new book
BookRouter.post("/add-book", upload.single("coverImage"), addBook);

// // Example route for updating a book
BookRouter.patch("/:id", updateBook);

// // Example route for deleting a book
BookRouter.delete("/:id", deleteBook);

ReviewRouter.post("/add-review",async(req,res)=>{
    try {
        const {user,book,bookTitle,bookAuthor,userName,rating,comment}=req.body;
        const review=new ReviewModel({
            user,
            book,
            bookTitle,
            bookAuthor,
            userName,
            rating,
            comment,
        })
        await review.save();
        res.status(200).json({
          success:true,
          message:"Review added successfully",
          review,
        })
    } catch (error) {
        console.log(error);
    }
})

ReviewRouter.get("/get-reviews/:bookId",async(req,res)=>{
    try {
        const bookId=req.params.bookId;
        const reviews=await ReviewModel.find({book:bookId}).populate("user","userName");
        res.json(reviews);
    } catch (error) {
        console.log(error);
    }
})

export { BookRouter };
export {ReviewRouter};
