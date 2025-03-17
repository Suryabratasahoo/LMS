import { NextResponse } from 'next/server';

// Store the JWT token in cookies
export const storeTokenInCookies = (token: string) => {
  const response = NextResponse.json({ message: 'Login successful' });
  
  // Set the token in cookies, with HttpOnly and SameSite to enhance security
  response.cookies.set('authToken', token, {
    httpOnly: true,  // Prevents JavaScript from accessing the cookie
    sameSite: 'strict',  // Restrict the cookie to the same site for additional security
    secure: process.env.NODE_ENV === 'production',  // Ensure the cookie is only sent over HTTPS in production
  });

  return response;
};
