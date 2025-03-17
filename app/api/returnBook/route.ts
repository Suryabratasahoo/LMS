import { NextRequest,NextResponse } from "next/server";
import ReturnRequest from "@/models/ReturnRequest"
import connectDB from "@/lib/connectDb";

export async function POST(req:NextRequest):Promise<NextResponse>{
    console.log("I am here");
    const { bookId, userId, fine } = await req.json();
    console.log(bookId,userId,fine);
    if(!bookId || !userId ){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
    try{
        await connectDB();
        const returnRequest=new ReturnRequest({user:userId,book:bookId,fine:fine});
        console.log(returnRequest);
        await returnRequest.save();
        return NextResponse.json({status:200});
    }catch(error){
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }

}

export async function GET(req:NextRequest):Promise<NextResponse>{
    console.log("I am here")
    const url=new URL(req.url);
    const userId=url.searchParams.get('userId');
    console.log(userId);
    if(!userId){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
    try{
        await connectDB();
        const returnRequests=await ReturnRequest.find({user:userId}).select('book')
        console.log(returnRequests);
        return NextResponse.json(returnRequests,{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}