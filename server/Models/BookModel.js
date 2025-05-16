import mongoose from "mongoose";

const BookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    author:{
        type:String,
        required:true,
        trim:true,
    },
    genre:{
        type:String,
        required:true,
        trim:true,
    },
    publishedYear:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    coverImage:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    rating:{
        type:Number,
        default:0,
    },
    reviews:{
        type:Array,
        default:[],
    },
    coverImage:{
        type:String,
        required:true,
    },
    rentalPrice:{
        type:Number,
        required:true,
    }
})

const BookModel=mongoose.model("Book",BookSchema);

export {BookModel};