import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/connectDb';
import User from '@/models/User';
import { storeTokenInCookies } from '@/lib/cookies';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'lskdjflksdjdgnlkvnoed';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { email, password, name,regNumber, category, genres } = body;

    if (!email || !password || !name || !category || !genres || genres.length === 0) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      regNumber,
      category,
      genres,
    });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '30d',
    });
    
    const responseWithToken = storeTokenInCookies(token);
    return responseWithToken;
  } catch (error) {
    console.error('Error signing up user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
