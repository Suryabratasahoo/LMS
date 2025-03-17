import connectDB from "@/lib/connectDb";
import { connect } from "http2";
import { NextResponse,NextRequest } from "next/server";
const User=require('@/models/User');

interface RequestBody {
    userId: string;
    bookId: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { userId, bookId }: RequestBody = await req.json();
        if (!userId || !bookId) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }
        await connectDB();

        const user = await User.findById(userId);
        console.log("user", user);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.wishlist.push(bookId);
        await user.save();

        return NextResponse.json({ user, message: "Book added to wishlist" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}