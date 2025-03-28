import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Space_Grotesk } from "next/font/google";




const font=Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <Toaster position="top-right" /> {/* Include Toaster here */}
        {children}
      </body>
      {/* <script src="https://cdn.lordicon.com/lordicon.js"></script> */}
    </html>
  );
}
