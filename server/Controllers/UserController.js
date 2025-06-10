import UserModel from "../Models/UserModel.js";
import BorrowModel from "../Models/BorrowModel.js";
import { BookModel } from "../Models/BookModel.js";
import Email from "../utils/Email.js";

export const borrowBooks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { bookId, days } = req.body;
    const user = await UserModel.findById(userId).populate("borrowedBooks");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  
    console.log(user.borrowedBooks);

    // Check if the book is already borrowed by the user
    const book = await BookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    console.log(bookId, userId);

   const isIncluded =user.borrowedBooks.some((book) => {
      return book._id.toString() === bookId.toString();
    });
   console.log(isIncluded);

    if (isIncluded) {
      return res.status(400).json({
        success: false,
        message: "Book already borrowed",
      });
    }
    // Check if the book is available for borrowing
    if (book.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book not available",
      });
    }
    if (days <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid number of days",
      });
    }
    user.borrowedBooks.push(bookId);
    user.borrowedBooksCount++;
    book.stock--;
    await user.save();
    await book.save();

    if (user.borrowedBooksCount >= book.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    const price = book.rentalPrice * days;
    console.log(price);

    const borrowDate = new Date().toISOString().split("T")[0];
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + days);

    const borrow = new BorrowModel({
      user: userId,
      book: bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      userName: user.name,
      borrowDate,
      returnDate: returnDate.toISOString().split("T")[0],
      amountPaid: price,
      days,
    });
    await borrow.save();
    //Send email notification

    const email = new Email();
    email.sendMailBookBorrowed(
      user.email,
      "Book Borrowed",
      user.name,
      book.title,
      book.author,
      borrowDate,
      returnDate.toISOString().split("T")[0]
    );

    res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
      data: [user, borrow],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const returnBooks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookId = req.body.bookId;
    console.log(userId, typeof bookId);
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Check if the book is in the user's borrowed books
    const bookIndex = user.borrowedBooks.indexOf(bookId);
    if (bookIndex > -1) {
      user.borrowedBooks.splice(bookIndex, 1);
      user.borrowedBooksCount--;
    } else {
      return res.status(404).json({
        success: false,
        message: "Book not found in borrowed books",
      });
    }
    await user.save();

    // Find the book and increase its stock
    const book = await BookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    book.stock++;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
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

export const getAllBorrowedBooks = async (req, res, next) => {
  try {
    const books=await BorrowModel.find()
    .populate("user", "name email")

     if(!books || books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No borrowed books found",
      });

    }

    res.status(200).json({
      success: true,
      message: "Borrowed books fetched successfully",
      totalBooks: books.length,
      data: books,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    
  }
}



export const getBorrowedBooks = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId).populate("borrowedBooks");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Borrowed books fetched successfully",
      totalBooks: user.borrowedBooksCount,
      data: user.borrowedBooks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users= await UserModel.find().populate("borrowedBooks");
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      totalUsers: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    
  }
}
export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId).populate("borrowedBooks");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
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