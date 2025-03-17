import connectDB from "@/lib/connectDb";
import { NextRequest,NextResponse } from "next/server";
import BookRequest from "@/models/BookRequest";

export async function GET(req:NextRequest):Promise<NextResponse>{
    console.log("Hello I am here");
    const url=new URL(req.url);
    const userId=url.searchParams.get("userId");
    const bookId=url.searchParams.get("bookId");
    console.log(userId,bookId);
    if(!userId || !bookId){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
    
    try{
        await connectDB();
        const bookRequest=await BookRequest.findOne({user:userId,book:bookId});
        console.log(bookRequest);
        return NextResponse.json(bookRequest,{status:200});
    }catch(error){
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}