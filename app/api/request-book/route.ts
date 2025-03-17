import connectDB from "@/lib/connectDb";
import { NextRequest,NextResponse } from "next/server";
import Request from "@/models/Request";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { title, author, isbn, genre, reason,user } = await req.json();
    if(!title || !author || !isbn || !genre || !reason || !user){
        return NextResponse.json({message:"Please fill in all fields."},{status:400});
    }
    try{
        await connectDB();
        const request=new Request({title,author,isbn,genre,reason,user});
        console.log(request);
        await request.save();
        return NextResponse.json({message:"Request submitted successfully."},{status:200});
    }catch(error){
        return NextResponse.json({message:(error as Error).message},{status:500});
    }

}