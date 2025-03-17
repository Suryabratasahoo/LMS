"use strict";
const mongoose = require("mongoose");
const Book=require("./Book")
const BookRequest=require("./BookRequest")
// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["student", "faculty","admin"], // Updated categories
    },
    genres: {
      type: [String],
      required: true,
      validate: {
        validator: (genres) => genres.length > 0,
        message: "At least one genre must be selected.",
      },
    },
    regNumber:{type:String,required:true},
    wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:"Book"}],
    borrowRequests:[
      {
        bookRequestId:{type:mongoose.Schema.Types.ObjectId,ref:"BookRequest"},
        bookId:{type:mongoose.Schema.Types.ObjectId,ref:"Book"},
      }
    ]
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
