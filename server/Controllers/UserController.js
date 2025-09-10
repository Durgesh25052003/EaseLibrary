import UserModel from "../Models/UserModel.js";
import BorrowModel from "../Models/BorrowModel.js";
import { BookModel } from "../Models/BookModel.js";
import Email from "../utils/Email.js";

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found",
      user,
    });
  } catch (error) {
    next(error);
  }
};

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

    console.log(user);

    // Check if the book is already borrowed by the user
    const book = await BookModel.findById(bookId);

    console.log(book, "🌟🌟");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    console.log(bookId, userId);

    const isIncluded = user.borrowedBooks.some((book) => {
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
    console.log(borrowDate, returnDate);

    // Adding the return date and borrowed date also in user Document in borrowed Books for easy display

    const borrow = new BorrowModel({
      user: userId,
      book: bookId,
      coverImage: book.coverImage,
      bookTitle: book.title,
      bookAuthor: book.author,
      userName: user.name,
      borrowDate,
      returnDate: returnDate.toISOString().split("T")[0],
      amountPaid: price,
      borrowCode: Math.floor(100000 + Math.random() * 900000), // Add this line
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
    const userId = req.body.userId;
    const bookId = req.body.bookId;
    console.log("🌟🌟🌟", userId, bookId);
    const user = await UserModel.findById(userId);
    console.log(user);
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

    //Removing returned Book data from BorrowedBook Model
    const borrowedBooks = await BorrowModel.find({
      book: bookId,
      user: userId,
    });

    console.log(borrowedBooks[0]);
    const borrowedBookId = borrowedBooks[0]._id;

    await BorrowModel.findByIdAndDelete(borrowedBookId);

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
    const books = await BorrowModel.find()
      .populate("user", "name email")
      .populate("book", "title author coverImage");

    if (!books || books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No borrowed books found",
        data: [],
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
};

export const getBorrowedBooks = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log("🌟🌟🌟");
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
    const users = await UserModel.find().populate("borrowedBooks");
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
};
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

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.favorites.includes(bookId)) {
      user.favorites.push(bookId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Book added to favorites",
      data: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.favorites = user.favorites.filter((id) => id.toString() !== bookId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Book removed from favorites",
      data: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Add these functions at the end of the file, after verifyBorrowCode

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
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

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    // Check if email already exists (excluding current user)
    if (email) {
      const existingUser = await UserModel.findOne({
        email: email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (req.file) updateData.profilePic = req.file.path;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyBorrowCode = async (req, res, next) => {
  try {
    const { borrowCode } = req.body;

    if (!borrowCode) {
      return res.status(400).json({
        success: false,
        message: "Borrow code is required",
      });
    }

    // Find borrow request by code
    const borrowRequest = await BorrowModel.findOne({
      borrowCode: parseInt(borrowCode),
      status: "pending",
    })
      .populate("user", "name email")
      .populate("book", "title author coverImage");

    if (!borrowRequest) {
      return res.status(404).json({
        success: false,
        message: "Invalid borrow code or request not found",
      });
    }
   // change status to borrow
    await borrowRequest.updateOne({ status: "borrowed" });
    await borrowRequest.save();
    
    console.log(borrowRequest);

    res.status(200).json({
      success: true,
      message: "Borrow code verified successfully",
      data: {
        borrowId: borrowRequest._id,
        user: borrowRequest.user,
        book: borrowRequest.book,
        borrowDate: borrowRequest.borrowDate,
        returnDate: borrowRequest.returnDate,
        days: borrowRequest.days,
        amountPaid: borrowRequest.amountPaid,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
