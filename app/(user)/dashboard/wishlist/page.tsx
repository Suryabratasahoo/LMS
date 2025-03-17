'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardHeader from "../components/DashboardHeader"
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Book {
  _id: string
  title: string
  author: string
  image: string
}

// Dummy data for wishlist books

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Book[]>([])
  const [wishlistId,setWishlistId]=useState<string[]>([])
  const [userId,setUserId]=useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Fetch the user's wishlist from the server
    const fetchWishList = async () => {
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
      if (!userDetails) {
        return;
      }
      setUserId(userDetails._id);
      if(userDetails.wishlist.length===0){
        setWishlistId([]);
        return;
      }else{
        // console.log("Wishlist:",userDetails.wishlist);
        setWishlistId(userDetails.wishlist);

      }
    }
    fetchWishList();

  }, [])
  useEffect(() => {
    console.log("WishList Id:",wishlistId)
    if(wishlistId.length===0){
      return;
    }
    const fetchWishList = async () => {
      try{
        // console.log("hello I am here")
        // console.log("wishlist:",wishlistId);
        const response=await fetch("/api/fetchWishListBooks",{
          method:"POST",
          headers:{
            "Content-Tyeps":"application/json"
          },
          body:JSON.stringify({wishlistId})
        })
        if(!response.ok){
          throw new Error("Failed to fetch wishlist");
        }
        const books=await response.json();
        // console.log("Books:",books);
        setWishlist(books);
      }catch(error){
        console.error("Failed to fetch wishlist",error);
      }
    }
    fetchWishList();
  }, [wishlistId])

  const removeFromWishlist = async(bookId: string) => {
    try{
      const response=await fetch("/api/removeFromWishList",{
          method:"POST",
          headers:{
              "content-Type":"application/json"
          },
          body:JSON.stringify({
              userId:userId,
              bookId:bookId
          })
      })
      const data=await response.json();
      if(response.ok){
        setWishlist(wishlist.filter(book => book._id !== bookId))
        toast.success('Book removed from wishlist')
          const updatedUser=data.user;

          localStorage.setItem("userDetails",JSON.stringify(updatedUser));
      }
  }catch(err){
      console.error("Error:",err)
  }

  }

  const navigateToBorrowPage = (bookId: string) => {
    // Navigate to the borrowing page for the specific book
    router.push(`/dashboard/borrow-book/${bookId}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Wishlist</h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {wishlist.map((book) => (
            <motion.div key={book._id} variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-w-2 aspect-h-1 mb-4">
                    <img
                      src={book.image || "/placeholder.svg"}
                      alt={`Cover of ${book.title}`}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => navigateToBorrowPage(book._id)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Borrow
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => removeFromWishlist(book._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        {wishlist.length === 0 && (
          <Card className="mt-6">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-600">Your wishlist is empty</p>
              <p className="text-gray-500 mt-2">Start adding books to your wishlist!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
