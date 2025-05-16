import {BookModel} from "../Models/BookModel.js";
import pkg from "http-status-codes";

const { HttpStatusCode } = pkg;

export const getAllBooks = async (req, res) => {
    try {
        const page= req.query.page?parseInt(req.query.page):1;
        const limit= req.query.limit?parseInt(req.query.limit):10;

        const skip=(page-1)*limit;
        const book=await BookModel.find({}).skip(skip).limit(limit);
        if(!book){
            return res.status(404).json({
                success:false,
                message:"No books found",
            })
        }
        res.status(200).json({
            success:true,
            message:"Books fetched successfully",
            totalBooks:book.length,
            data:book,
        })
    } catch (error) {
        console.log(error)
    }
}

export const addBook=async (req, res) => {
    try {
        let { title, author, genre, publishedYear, description,price, stock } = req.body;

        const coverImage = req.file.path; // Assuming you are using multer to handle file uploads
        console.log(coverImage)

        const book = new BookModel(
            {
                title,
                author,
                genre,
                publishedYear,
                description,
                coverImage,
                price,
                stock
            }
        );
        await book.save();
        res.status(201).json({
            success:true,
            message:"Book added successfully",
            data:book,
        })
    } catch (error) {   
        console.log(error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Internal server error",
        })
    }
}

// Update
export const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const updatedData = req.body;
        const updatedBook = await BookModel.findByIdAndUpdate(bookId, updatedData, {
            new: true,
            runValidators: true,
        });
        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
}


export const deleteBook=async (req, res,next) => {
    try {
        const book= await BookModel.findByIdAndDelete(req.params.id,{
            new:true,
            runValidators:true,
        });
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book not found",
        })  
        }
        res.status(200).json({
            success:true,
            data:book,
            message:"Book deleted successfully",
        })
    } catch (error) {
        console.log(error)
    }
}

export const getSingleBook=async (req, res) => {
    try {
        const book=await BookModel.findById(req.params.id);
        if(!book){
            return res.status(404).json({
                success:false,
                message:"Book not found",
            })
        }
        res.status(200).json({
            success:true,
            message:"Book fetched successfully",
            data:book,
        })
    } catch (error) {
        console.log(error)
    }
}


