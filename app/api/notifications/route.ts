import connectDB from "@/lib/connectDb";
import Notification from "@/models/Notification";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest): Promise<NextResponse> {
    const url = new URL(req.url);
    const userId=url.searchParams.get('userId');
    if(!userId){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
    try{
        await connectDB();
        const notifications=await Notification.find({user:userId}).limit(5).sort({createdAt:-1})
        return NextResponse.json(notifications,{status:200});
    }catch(error){
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    const url=new URL(req.url);
    const id=url.searchParams.get('id');
    if(!id){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
    try{
        await connectDB();
        await Notification.findByIdAndUpdate(id,{isRead:true},{new:true});
        return NextResponse.json({status:200});
    }catch(error){
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}


export async function DELETE(req:NextRequest):Promise<NextResponse>{
    const url=new URL(req.url);
    const id=url.searchParams.get('id');
    if(!id){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
    try{
        await connectDB();
        await Notification.findByIdAndDelete(id);
        return NextResponse.json({status:200});
    }catch(error){
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}