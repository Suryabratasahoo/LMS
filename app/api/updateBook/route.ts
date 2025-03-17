import connectDB from "@/lib/connectDb";
import Book from "@/models/Book";
import {NextRequest,NextResponse} from "next/server";

export async function PUT(req:NextRequest):Promise<NextResponse> {
    const formData=await req.json();
    console.log(formData);
    if(!formData._id){
        return NextResponse.json({message:"Id is required"},{status:400});
    }
    try{
        await connectDB();
        console.log("I am here")
        const book=await Book.findById(formData._id);
        console.log("I am here");
        console.log("book",book)
        if(!book){
            return NextResponse.json({message:"Book not found"},{status:404});
        }
        book.title=formData.title;
        book.author=formData.author;
        book.description=formData.description;
        book.isbn=formData.isbn;
        book.ratings=formData.ratings;
        book.availableCopies=formData.availableCopies;
        book.image=formData.image;
        book.genre=formData.genre;
        book.price=formData.price;
        await book.save();
        return NextResponse.json({message:"Book updated successfully"},{status:200});
    }catch(error){
        return NextResponse.json({message:"internal server error"},{status:500});
    }
}

export async function DELETE(req:NextRequest):Promise<NextResponse> {
    const url=new URL(req.url);
    console.log(url);
    const bookID=url.searchParams.get("bookId");
    if(!bookID){
        return NextResponse.json({message:"Book ID is required"},{status:400});
    }
    try{
        connectDB();
        const book=await Book.findById(bookID);
        console.log("book",book);
        await Book.findByIdAndDelete(bookID);
        return NextResponse.json({message:"Book deleted successfully"},{status:200});
    }catch(error){
        return NextResponse.json({message:"Internal server error"},{status:500});
    }
}
