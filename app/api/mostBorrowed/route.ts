import {NextResponse} from 'next/server';
import connectDB from '@/lib/connectDb';
import Book from '@/models/Book';

export async function GET(){
    try{
        await connectDB();
        const books=await Book.find().sort({borrowCount:-1}).limit(5);

        return NextResponse.json(books,{status:200});
    }catch(error){
        return NextResponse.json({error:error},{status:500});
    }
}