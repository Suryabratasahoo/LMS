"use strict"

const mongoose=require("mongoose");


// defining the book schema
const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String,
        required:true
    },
    publisher:{
        type:String,
        required:true,
        trim:true
    },
    language:{
        type:String,
        required:true,
        trim:true
    },
    paperback:{
        type:Number,
        required:true
    },
    isbn:{
        type:String,
        required:true
    },
    dimension:{
        length:{required:true,type:Number},
        width:{required:true,type:Number},
        height:{required:true,type:Number}
    },
    genre:{
        type:String,
        required:true,
    },
    totalCopies:{
        type:Number,
        required:true
    },
    availableCopies:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    ratings:{
        type:Number,
        required:true
    },
    borrowCount:{
        type:Number,
        required:true
    }
})

const Book=mongoose.models.Book || mongoose.model("Book",bookSchema);
module.exports=Book;