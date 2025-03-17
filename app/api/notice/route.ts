import connectDB from "@/lib/connectDb";
import Notice from "@/models/Notice";
import { NextRequest,NextResponse } from "next/server";

interface RequestBody{
    title:string;
    description:string;
    type:string;
}

export async function POST(req: NextRequest) {
    try{
        const {type,title,description}:RequestBody=await req.json();
        console.log(type,title,description);
        if(!title || !description || !type){
            return NextResponse.json({error:"All fields are required"},{status:400});
        }
        await connectDB();
        const notice=await Notice.create({title,description,type});
        console.log(notice);
        notice.save();
        return NextResponse.json({message:"Notice created successfully"},{status:200});
        
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}

export async function GET() {
    try{
        console.log("I am here")
        await connectDB();
        const notices=await Notice.find({});
        console.log(notices);
        return NextResponse.json(notices,{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"problem in fetching notices"},{status:500});
    }
}