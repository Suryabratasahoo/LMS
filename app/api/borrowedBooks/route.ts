import connectDB from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import BorrowedBooks, { find, findById } from "@/models/BorrowedBooks";
import User from "@/models/User";

export async function GET(req: NextRequest): Promise<NextResponse> {
    console.log("hello I am here")
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    console.log(userId)
    if (!userId) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    try {
        await connectDB();
        const borrowedBooks = await BorrowedBooks.find({ user: userId,status:"Borrowed" }).populate('book', 'title author image');
        return NextResponse.json(borrowedBooks, { status: 200 });
    }catch(error){
        return NextResponse.json({error:error},{status:500});
    }
    
}
