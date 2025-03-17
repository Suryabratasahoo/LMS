import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/connectDb';// Import your MongoDB connection function
import User from '@/models/User'; // Import the Mongoose User model
import { storeTokenInCookies } from '@/lib/cookies';
// Replace with your JWT secret key (use environment variables in production)
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'lskdjflksdjdgnlkvnoed';

export async function POST(req: Request) {
  try {
    
    // Parse request body
    const body = await req.json();
    const { email, password} = body;

    if (!email || !password ) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    await connectDB();
    // Check if the user already exists
    const existingUser = await User.findOne({ email }); // Mongoose query to check for existing user
    if (!existingUser) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });
    }
    
    const isMatch=await bcrypt.compare(password,existingUser.password);
    if(!isMatch){
        return NextResponse.json({ error: "Invalid Credentials" }, { status: 400 });
    }
    const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, JWT_SECRET, {
          expiresIn: '30d', 
        });
    const responseWithToken = storeTokenInCookies(token);
    return responseWithToken;
    // Return the token
    
  } catch (error) {
    console.error('Error Logging in user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
