import connectDB from "@/lib/connectDb";
import {NextResponse,NextRequest} from "next/server"
import ReturnRequest from "@/models/ReturnRequest";
import Book from "@/models/Book";
import User from "@/models/User";
import BorrowedBooks from "@/models/BorrowedBooks";


export async function GET(req:NextRequest):Promise<NextResponse>{
    try{
        await connectDB();
        console.log("connected to db");
        const returnRequests=await ReturnRequest.find({status:"pending"}).populate('book','title ').populate('user','name regNumber');
        console.log(returnRequests);
        return NextResponse.json(returnRequests,{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}

export async function PATCH(req:NextRequest):Promise<NextResponse>{
    const url=new URL(req.url);
    const id=url.searchParams.get('id');
    const userId=url.searchParams.get('userId');
    const bookId=url.searchParams.get('bookId');
    console.log(id,userId,bookId);
    if(!id || !userId || !bookId){
        return NextResponse.json({error:"Invalid data"},{status:400});
    }
    try{
        await connectDB();
        console.log("connected to dbdljfksdjfjkdskfjdskf");
        await ReturnRequest.findByIdAndUpdate(id,{status:"approved"});
        const user=await User.findById(userId);
        user.borrowRequests = user.borrowRequests.filter(
            (book: { bookId: string }) => book.bookId.toString() !== bookId
        );
        await user.save();
        await BorrowedBooks.findOneAndUpdate({book:bookId,user:userId},{status:"Returned"});
        await Book.findByIdAndUpdate(bookId,{$inc:{availableCopies:1}});
        return NextResponse.json({message:"Request has been approved"},{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}