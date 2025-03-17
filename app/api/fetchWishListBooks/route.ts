import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/connectDb";
import Book from "@/models/Book";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { wishlistId } = await req.json();
    console.log("Wishlist:", wishlistId);

    if (!wishlistId || wishlistId.length === 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const books = await Book.find({ _id: { $in: wishlistId } });
    // console.log(books);
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.log("Error fetching wishlist books:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist books" }, { status: 500 });
  }
}