"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Star, Heart, Share2, ChevronRight, AlertCircle, BookOpen, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UpdateDialogue } from "../components/updateDialogue"

interface user {
  _id: string,
  name: string,
  regNumber: string
}

interface Review {
  _id: string
  user: user
  rating: number
  comment: string
  createdAt: string
}

interface Book {
  _id: string
  title: string
  author: string
  image: string
  description: string
  publisher: string
  language: string
  paperback: number
  isbn: string
  dimension: {
    length: number
    width: number
    height: number
  }
  totalCopies: number
  availableCopies: number
  price: number
  ratings: number
}
export default function BookDetails() {
  const router = useRouter()
  const { id } = useParams()
  const [book, setBook] = useState<any>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")
  const [user, setUser] = useState<any>({})
  const [reviews, setReviews] = useState<Review[]>([])
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdateDialogueOpen, setIsUpdateDialogueOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState({comment:"",rating:0,reviewId:""});
  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchUser = async () => {
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
      try {
        const response = await fetch(`/api/fetchUser?id=${userDetails._id}`);
        const data = await response.json();
        setUser(data);
        localStorage.setItem("userDetails", JSON.stringify(data));
        if (data.wishlist && data.wishlist.includes(id)) {
          console.log(data.wishlist);
          setIsWishlisted(true);
        }
        setUserId(data._id);
      } catch (error) {
        console.error("Error:", error)
      }
    }
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/fetchBook/${id}`);
        const data = await response.json();
        setBook(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book:", error);
        setLoading(false);
      }
    }
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/Review?bookId=${id}`);
        const data = await response.json();
        setReviews(data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchUser();
    fetchBook();
    fetchReviews();

  }, [id])

  const handleRatingChange = (newRating: number) => {
    setUserRating(newRating)
  }

  const handleBack = () => {
    router.back()
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);
    if (!userRating) {
      toast.error("Please select a rating before submitting your review.")
      return
    }
    if (!userReview) {
      toast.error("Please write a review before submitting.")
      return
    }
    try {
      const response = await fetch("/api/Review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          bookId: id,
          rating: userRating,
          comment: userReview
        })
      })
      if (!response.ok) {
        throw new Error("Failed to submit review")
      }
      const data = await response.json()
      const review = { _id: data._id, user: { _id: userId, name: user.name, regNumber: user.regNumber }, rating: userRating, comment: userReview, createdAt: new Date().toISOString() }
      setReviews([...reviews, review])
      setIsSubmitting(false)
      setUserRating(0)
    } catch (err) {
      console.error("Error:", err)
      toast.error("Failed to submit review")
    }

  }

  if (!loading && !book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-24 w-24 text-yellow-500" />
          <h2 className="text-2xl font-bold">Book Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            We&apos;re sorry, but the book you&apos;re looking for is not currently in our library.
          </p>
          <Button onClick={handleBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }
  const handleDeleteReview = async (id: string) => {
    try {
      const response = await fetch(`/api/Review?reviewId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      setReviews(reviews.filter(review => review._id !== id));
      toast.success("Review deleted successfully");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to delete review");
    }
  }
  const handleWishlist = async () => {
    if (!isWishlisted) {
      try {
        const response = await fetch("/api/addToWishList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user._id,
            bookId: book._id
          })
        })
        const data = await response.json()
        console.log(data)
        if (response.ok) {
          toast.success(data.message)
          const updatedUser = data.user;
          setIsWishlisted(true);
          localStorage.setItem("userDetails", JSON.stringify(updatedUser));
        } else {
          toast.error("Failed to add book to wishlist")
        }
      } catch (err) {
        console.error("Error:", err)
      }
    } else {
      try {
        const response = await fetch("/api/removeFromWishList", {
          method: "POST",
          headers: {
            "content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user._id,
            bookId: book._id
          })
        })
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
          const updatedUser = data.user;
          setIsWishlisted(false)
          localStorage.setItem("userDetails", JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error("Error:", err)
      }
    }

  }

  return (
    <div className="min-h-screen bg-background">
      {loading ? (
        <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BookOpen className="h-24 w-24 text-gray-500 animate-pulse" />
        </div>
      ) : (
        <>
          <main className="container px-4 py-8 flex">
            {/* Left Section (Image) */}
            <div className="w-1/3 sticky top-0 h-screen overflow-hidden">
              <div className="space-y-4">
                <motion.div
                  className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 h-full w-full"
                    >
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* Right Section (Product Info) */}
            <div className="w-2/3 overflow-y-auto h-screen px-4">
              {/* Breadcrumb */}
              <nav className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/dashboard/books" className="hover:text-foreground">
                  Books
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{book.title}</span>
              </nav>

              {/* Product Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{book.title}</h1>
                  <p className="text-lg text-muted-foreground">by {book.author}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(book.ratings)
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted-foreground"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({book.ratings} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleWishlist} variant={isWishlisted ? "default" : "outline"}>
                    <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="details">Book Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="space-y-4 mt-8">
                    <p className="text-muted-foreground">{book.description}</p>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4 mt-8">
                    <dl className="space-y-4">
                      {book && (
                        <>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">Publisher</dt>
                            <dd className="text-muted-foreground">{book.publisher}</dd>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">Language</dt>
                            <dd className="text-muted-foreground">{book.language}</dd>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">Paperback</dt>
                            <dd className="text-muted-foreground">{book.paperback} pages</dd>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">ISBN</dt>
                            <dd className="text-muted-foreground">{book.isbn}</dd>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">Dimensions</dt>
                            <dd className="text-muted-foreground">
                              {book.dimension.length} x {book.dimension.width} x {book.dimension.height} inches
                            </dd>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">Total Copies</dt>
                            <dd className="text-muted-foreground">{book.totalCopies}</dd>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">Available Copies</dt>
                            <dd className="text-muted-foreground">{book.availableCopies}</dd>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">Price</dt>
                            <dd className="text-muted-foreground">${book.price}</dd>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <dt className="font-medium">Ratings</dt>
                            <dd className="text-muted-foreground">{book.ratings} / 5</dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </TabsContent>
                  <TabsContent value="reviews" className="space-y-4 mt-4">
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block mb-2">Your Rating</label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingChange(star)}
                                className={`text-2xl ${star <= userRating ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="review" className="block mb-2">
                            Your Review
                          </label>
                          <Textarea
                            id="review"
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                            rows={4}
                            placeholder="Write your review here..."
                          />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                          {
                            isSubmitting ? (
                              <>
                                <BookOpen className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                              </>
                            ) : (
                              "Submit Review"
                            )
                          }
                        </Button>
                      </form>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Reviews</h3>
                      {reviews.map((review) => (
                        <Card key={review._id} className="mb-4">
                          <CardHeader>
                            <CardTitle className="flex items-center">

                              <User className="mr-2" />
                              {review.user.name}({review.user.regNumber})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400 mt-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                              {review.user._id === userId && (
                                <div className="space-x-4">
                                  <Button onClick={() => { handleDeleteReview(review._id) }}>delete</Button>
                                  <Button onClick={() => {
                                    setSelectedReview({
                                      comment: review.comment,
                                      rating: review.rating,
                                      reviewId: review._id
                                    })
                                    setIsUpdateDialogueOpen(true)
                                  }}>
                                    update
                                  </Button>
                                </div>
                              )}

                            </div>
                            <UpdateDialogue
                              open={isUpdateDialogueOpen}
                              onOpenChange={setIsUpdateDialogueOpen}
                              data={selectedReview}
                            />
                          </CardContent>

                        </Card>

                      ))}
                    </div>
                  </TabsContent>

                </Tabs>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  )
}

