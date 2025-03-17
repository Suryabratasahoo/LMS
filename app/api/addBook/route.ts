import connectDB from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import Book from "@/models/Book";
import Notice from "@/models/Notice";

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectDB();
  try {
    console.log("I am here")
    const formData=await req.json();
    console.log(formData);
    if ( !formData.title ||
        !formData.author ||
        !formData.description ||
        !formData.image ||
        !formData.publisher ||
        !formData.language ||
        !formData.paperback ||
        !formData.isbn ||
        !formData.length ||
        !formData.width ||
        !formData.height ||
        !formData.genre ||
        !formData.totalCopies||  
        !formData.price||
        !formData.rating) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const dimension={length:formData.length,width:formData.width,height:formData.height}
    const book = new Book({title:formData.title,
    author:formData.author,
    description:formData.description,
    image:formData.image,
    publisher:formData.publisher,
    language:formData.language,
    paperback:formData.paperback,
    isbn:formData.isbn,
    dimension:dimension,
    genre:formData.genre,
    totalCopies:formData.totalCopies,
    availableCopies:formData.totalCopies,
    price:formData.price,
    ratings:formData.rating,
    borrowCount:0
  });
    console.log(book);
    await book.save();
    const notice = new Notice({title: "New Book Added", description: `A new book titled ${formData.title} has been added to the library.Kindly check it out.We would be thankful for your feedback`,type:"NewBook"});
    await notice.save();
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error("Error during new book request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}