"use strict"

const mongoose=require("mongoose");
const User=require("./User");
const Book=require("./Book");


const returnRequestSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Book"
    },
    fine:{
        type:Number,
        required:true,
        default:0
    },
    status:{
        type:String,
        required:true,
        enum:["pending","approved"],
        default:"pending"
    }
    
},{timestamps:true});

const ReturnRequest=mongoose.models.ReturnRequest || mongoose.model("ReturnRequest",returnRequestSchema);
module.exports=ReturnRequest;