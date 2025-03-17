import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/lib/connectDb";
import User from "@/models/User";
interface RequestBody {
    userId: string;
    bookId: string;
}
export async function POST(req: NextRequest): Promise<NextResponse> {
        try{
            const {userId,bookId}:RequestBody=await req.json();
            if(!userId || !bookId){
                return NextResponse.json({error:"Invalid data"},{status:400});
            }
            await connectDB();
            const user=await User.findById(userId);
            if(!user){
                return NextResponse.json({error:"User not found"},{status:404});
            }
            user.wishlist.remove(bookId);
            await user.save();

            return NextResponse.json({user,message:"Book removed from wishlist"},{status:200});
        }catch (error) {
            console.log(error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
}