/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET); // Use an environment variable for production

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  if (token) {
    try {
      // Verify the token
      if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined');
      }
      await jwtVerify(token, SECRET_KEY);

      // Redirect authenticated users from /signin or /signup to /dashboard
      if (req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next(); // Proceed to the requested page
    } catch (err: any) {
      console.error('Invalid Token:', err);
      if (err.code === 'ERR_JWT_EXPIRED') {
        // Redirect to sign-in if token is expired
        return NextResponse.redirect(new URL('/signin', req.url));
      }
      // Redirect to sign-in if token is invalid
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  } else {
    // Redirect to sign-in if token is missing and trying to access protected routes
    if (
      req.nextUrl.pathname !== '/signin' &&
      req.nextUrl.pathname !== '/signup'
    ) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next(); // Proceed to the requested page
}

// Apply middleware to protected routes
export const config = {
  matcher: ['/signin', '/signup', '/dashboard/:path*'], // Matches all routes under /dashboard
};
