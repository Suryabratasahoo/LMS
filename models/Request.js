"use strict"

const mongoose=require("mongoose");
// defining the request schema
const User=require("./User");

const requestSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    isbn:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true,
    },
    reason:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},{
    timestamps:true
})

const Request=mongoose.models.Request || mongoose.model("Request",requestSchema);

module.exports=Request;