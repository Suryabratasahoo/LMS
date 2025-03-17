
import connectDB from "@/lib/connectDb";
import BookRequest from "@/models/BookRequest";
import Book from "@/models/Book";
import User from "@/models/User";
import BorrowedBooks from "@/models/BorrowedBooks";
import Notification from "@/models/Notification";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody{
    userId:string;
    bookId:string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try{
        const {userId,bookId}:RequestBody=await req.json();
        // console.log(userId,bookId);
        if(!userId || !bookId){
            return NextResponse.json({error:"Invalid data"},{status:400});
        }
        await connectDB();
        const user=await User.findById(userId);
        if(!user){
            return NextResponse.json({error:"User not found"},{status:404});
        }
        const book=await Book.findById(bookId);
        if(!book){
            return NextResponse.json({error:"Book not found"},{status:404});
        }
        const bookRequest=new BookRequest({
            user:user._id,
            book:book._id,
        });
        // console.log(bookRequest);
        await bookRequest.save();
        // user.borrowRequests.push({bookRequestId:bookRequest._id,bookId:book._id});
        // await user.save();
        return NextResponse.json({user,message:"Borrowing Request has been sent"},{status:200});


    }catch(error){
        return NextResponse.json({error:error},{status:500});
    }
}



// getting all borrow requests
export async function GET(req: NextRequest): Promise<NextResponse> {
    try{
        await connectDB();
        const borrowRequests=await BookRequest.find({status:"pending"}).populate('book','title').populate('user','name regNumber');
        // console.log(borrowRequests);
        return NextResponse.json(borrowRequests,{status:200});
    }catch(error){
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}

// approving or rejecting the request
export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const action = url.searchParams.get('action');
        const userId=url.searchParams.get('userId');
        // console.log(id, action);
        if(!id || !action){
            return NextResponse.json({error:"Invalid data"},{status:400});
        }
        await connectDB();
        const request=await BookRequest.findById(id);
        if(!request){
            return NextResponse.json({error:"Request not found"},{status:404});
        }
        if(action==="approve"){
            const user=await User.findById(userId);
            // console.log(request.book);
            // console.log(request.user);
            const borrowedBook=new BorrowedBooks({user:request.user,book:request.book,borrow_date:new Date(Date.now()),due_date:new Date(Date.now()+7*24*60*60*1000),fine:0,status:"Borrowed"});
            // console.log(borrowedBook);
            await borrowedBook.save();

            request.status="approved";
            console.log("i reached till here")
            user.borrowRequests.push({bookRequestId:request._id,bookId:request.book});
            await user.save();
            console.log("i reached till here");
            // console.log('I am here')
            const book=await Book.findById(request.book);
            // sending notification to user
            const notification=new Notification({user:request.user,message:`Your request for borrowing ${book.title} has been approved`,type:"Approval"});
            await notification.save();
            // console.log(book);
            book.availableCopies-=1;
            book.borrowCount+=1;
            // console.log(book);
            await book.save();
            await request.save();
        }else{
            await BookRequest.findByIdAndDelete(id);
            const user=await User.findById(userId);
            user.borrowRequests=user.borrowRequests.filter((request: { bookRequestId: string }) => request.bookRequestId.toString() !== id);
            const book=await Book.findById(request.book);
            // sending notification to user
            const notification=new Notification({user:request.user,message:`Your request for borrowing ${book.title} has been rejected`,type:"Rejection"});
            await notification.save();
            await book.save();
            await user.save();
        }
        return NextResponse.json({message:"Request has been "+action},{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Error while approving request"},{status:500});
    }
}