"use strict"
const mongoose=require("mongoose");
const { type } = require("os");

// defining the wishlist schema
const wishlistSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    
})