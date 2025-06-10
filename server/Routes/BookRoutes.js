import express from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "../Controllers/BookController.js";
import upload from "../utils/multer.js";

const BookRouter = express.Router();

// Example route for getting all books
BookRouter.get("/getAllBooks", getAllBooks);

// Example route for adding a new book
BookRouter.post("/add-book", upload.single("coverImage"), addBook);

// // Example route for updating a book
BookRouter.patch("/:id", updateBook);

// // Example route for deleting a book
BookRouter.delete("/:id", deleteBook);

export { BookRouter };
