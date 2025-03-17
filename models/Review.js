const mongoose=require('mongoose');
import User from './User';
import Book from './Book';

const reviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

const Review=mongoose.models.Review || mongoose.model('Review',reviewSchema);
export default Review;