"use strict"
const mongoose=require("mongoose");
const User=require("./User");

const notificationSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    
    message:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
        enum:["Reminder","Announcement","Approval","Rejection","Overdue"]
    },
    isRead:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

const Notification=mongoose.models.Notification || mongoose.model("Notification",notificationSchema);

module.exports=Notification;