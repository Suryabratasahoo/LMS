"use strict"
const mongoose=require("mongoose");
const Book=require("./Book");
const User=require("./User");

const bookRequestSchema=mongoose.Schema({
    book:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Book"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},{timestamps:true});

const BookRequest=mongoose.models.BookRequest||mongoose.model("BookRequest",bookRequestSchema);
module.exports=BookRequest;