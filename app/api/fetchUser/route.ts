import connectDB from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if(!id){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
  await connectDB();
  try{
    const user=await User.findById(id);
    return NextResponse.json(user,{status:200});
  }catch(error){
    return NextResponse.json({error:error},{status:500});
  }
}