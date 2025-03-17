import connectDB from "@/lib/connectDb";
import { NextRequest,NextResponse } from "next/server";
import Review from "@/models/Review"


export async function POST(req:NextRequest):Promise<NextResponse> {
    const {userId,bookId,rating,comment}=await req.json();
    console.log(userId,bookId,rating,comment);
    if(!userId || !bookId || !rating || !comment){
        return NextResponse.json({message:"All fields are required"},{status:400});
    }
    try{
        await connectDB();
        const review=new Review({book:bookId,user:userId,rating:rating,comment:comment});
        await review.save();
        console.log(review);
        return NextResponse.json({message:"Review added successfully",data:review},{status:201});
    }catch(error){
        console.log(error);
        return NextResponse.json({message:"Internal server error"},{status:500});
    }
}

export async function GET(req:NextRequest):Promise<NextResponse> {
    const url=new URL(req.url);
    const bookId=url.searchParams.get("bookId");
    if(!bookId){
        return NextResponse.json({message:"Book ID is required"},{status:400});
    }
    try{
        await connectDB();
        const reviews=await Review.find({book:bookId}).populate("user","name regNumber")
        return NextResponse.json({message:"Reviews fetched successfully",data:reviews},{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({message:"Internal server error"},{status:500});
    }
}

export async function DELETE(req:NextRequest):Promise<NextResponse> {
    const url=new URL(req.url);
    const reviewId=url.searchParams.get("reviewId");
    if(!reviewId){
        return NextResponse.json({message:"Review ID is required"},{status:400});
    }
    try{
        await connectDB();
        await Review.findByIdAndDelete(reviewId);
        return NextResponse.json({message:"Review deleted successfully"},{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({message:"Internal server error"},{status:500});   
    }
}

export async function PUT(req:NextRequest):Promise<NextResponse> {
    const url=new URL(req.url);
    const reviewId=url.searchParams.get("reviewId");
    const {rating,comment}=await req.json();
    console.log(reviewId,rating,comment);
    if(!reviewId || !rating || !comment){
        return NextResponse.json({message:"All fields are required"},{status:400});
    }
    try{
        await connectDB();
        await Review.findByIdAndUpdate(reviewId,{rating:rating,comment:comment});
        return NextResponse.json({message:"Review updated successfully"},{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({message:"Internal server error"},{status:500});
    }
}