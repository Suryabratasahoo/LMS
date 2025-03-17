import {NextResponse} from 'next/server';
import connectDB from '@/lib/connectDb';
import Book from '@/models/Book';

export async function GET(){
    try{
        await connectDB();
        const books=await Book.find();
        return NextResponse.json(books,{status:200});
    }catch(error){
        return NextResponse.json({error:"Failed to fetch books"},{status:500});
    }
}