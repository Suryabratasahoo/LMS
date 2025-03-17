import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/connectDb";
import Book from "@/models/Book";

interface NextRequestContext {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, context: NextRequestContext) {
  try {
    await connectDB();
    const { id } = context.params;

    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

