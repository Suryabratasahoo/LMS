"use strict";
const { time } = require("console");
const mongoose=require("mongoose");
const { ModuleResolutionKind } = require("typescript");

// defining Notice schema
const noticeSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:["event","announcement","update","NewBook"],
        default:"announcement"
    },
    
},{timestamps:true})

const Notice=mongoose.models.Notice || mongoose.model("Notice",noticeSchema);

module.exports=Notice;