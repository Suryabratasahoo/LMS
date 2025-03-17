    "use strict";

    const mongoose=require("mongoose");
    const Book=require("./Book");
    const User=require("./User");
    // defining borrowedBooks schema

    const borrowedBooksSchema=mongoose.Schema({
        book:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Book"
        },
        borrow_date:{
            type:Date,
            required:true,
            default:Date.now
        },
        due_date:{
            type:Date,
            required:true,
        },
        return_date:{
            type:Date,
        },
        fine:{
            type:Number,
            default:0
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        status:{
            type:String,
            required:true,
            enum:["Borrowed","Returned"],
            default:"Borrowed"
        }
    })

    const BorrowedBooks=mongoose.models.BorrowedBooks || mongoose.model("BorrowedBooks",borrowedBooksSchema);
    module.exports=BorrowedBooks;