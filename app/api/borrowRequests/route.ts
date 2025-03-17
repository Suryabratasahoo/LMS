import connectDB from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import BookRequest from "@/models/BookRequest";
import moment from 'moment';

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectDB();
  try{
    const requests=await BookRequest.find({status:"pending"}).populate('book').populate('user');
    const formattedRequests=requests.map((request)=>{
        const formattedDate = moment(request.createdAt).format("YYYY-MM-DD HH:mm");
        const time=formattedDate.split(" ")[1];
        const date=formattedDate.split(" ")[0];
        const info={id:request._id,user:request.user.name,book:request.book.title,date:date};
        return info
    });
    return NextResponse.json({formattedRequests},{status:200});
  }catch(erro){
    return NextResponse.json({error:"Internal Server Error"},{status:500});
  }
}