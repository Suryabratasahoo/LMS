"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Star, Heart, Share2, ChevronRight, BookOpen, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "react-hot-toast"

// Mock data for books (you should replace this with actual data fetching)
const mockBooks = [
    {
        id: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        image: "/mockingbird.jpg",
        description:
            "To Kill a Mockingbird is a 1960 novel by Harper Lee that became an instant classic, earning widespread acclaim and winning the Pulitzer Prize in 1961. The novel is regarded as one of the most significant works of modern American literature, praised for its powerful themes of racial injustice, moral growth, and empathy.",
        rating: 4.5,
        reviews: 222,
        details: {
            publisher: "Scribner",
            language: "English",
            paperback: "180 pages",
            isbn: "978-0743273565",
            dimensions: "5.31 x 0.5 x 8.25 inches",
        },
        availability: {
            status: "Available",
            copies: 3,
            estimatedReturnDate: "2023-07-15",
        },
    },
    // ... (other book data remains unchanged)
]

export default function BookDetails() {
    const router = useRouter()
    const { id } = useParams()
    const [book, setBook] = useState<any>(null)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [selectedFormat, setSelectedFormat] = useState("physical");
    const [loading, setLoading] = useState(true);
    const [userId,setUserId]=useState("");
    const [text,setText]=useState("");
    const [isRequested,setIsRequested]=useState(false);
    const [user,setUser]=useState<any>({});

    useEffect(() => {
        if (!id) {
            return;
        }
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
        const fetchUser=async()=>{
            
            try{
                const response=await fetch(`/api/fetchUser?id=${userDetails._id}`);
                const data=await response.json();
                console.log(data);
                setUser(data);
                localStorage.setItem("userDetails",JSON.stringify(data));
                if(data.wishlist && data.wishlist.includes(id)){
                    setIsWishlisted(true);
                }
                if(data.borrowRequests && data.borrowRequests.some((request:any)=>request.bookId==id)){
                    setIsRequested(true);
                }
                else{
                    setIsRequested(false);
                }
                setUserId(user._id);
            }catch(error){
                console.error("Error:",error)
            }
            

        }
        const fetchRequest=async()=>{
            try{
                const response=await fetch(`/api/fetchRequest?userId=${userDetails._id}&bookId=${id}`);
                const data=await response.json();
                setText(data.status);
            }catch(error){
                console.error("Error:",error)
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
        fetchUser();
        fetchRequest();
        fetchBook();
   

    }, [])

    

    const handleBack = () => {
        router.back();
    }

    if (!loading && !book) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <AlertCircle className="h-24 w-24 text-yellow-500" />
                    <h2 className="text-2xl font-bold">Book Not Found</h2>
                    <p className="text-lg text-muted-foreground max-w-md">
                        We're sorry, but the book you're looking for is not currently in our library.
                    </p>
                    <Button onClick={handleBack} variant="outline">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }



    const handleWishlist = async() => {
        if(!isWishlisted){
            try{
                const response=await fetch("/api/addToWishList",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        userId:user._id,
                        bookId:book._id
                    })
                })
                const data=await response.json()
                console.log(data)
                if(response.ok){
                    toast.success(data.message)
                    const updatedUser=data.user;
                    setIsWishlisted(true);
                    localStorage.setItem("userDetails",JSON.stringify(updatedUser));
                }else{
                    toast.error("Failed to add book to wishlist")
                }
            }catch(err){
                console.error("Error:",err)
            }
        }else{
            try{
                const response=await fetch("/api/removeFromWishList",{
                    method:"POST",
                    headers:{
                        "content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        userId:user._id,
                        bookId:book._id
                    })
                })
                const data=await response.json();
                if(response.ok){
                    toast.success(data.message);
                    const updatedUser=data.user;
                    setIsWishlisted(false)
                    localStorage.setItem("userDetails",JSON.stringify(updatedUser));
                }
            }catch(err){
                console.error("Error:",err)
            }
        }
        
    }

    const handleBorrow = async() => {
        console.log(user._id,book._id);
        if(selectedFormat==="physical"){
            try{
                const response=await fetch('/api/borrow-request',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        userId:user._id,
                        bookId:book._id
                    })
                })
                if(!response.ok){
                    return toast.error("Failed to request the book")
                }
                const data=await response.json();
                localStorage.setItem("userDetails",JSON.stringify(data.user));
                setIsRequested(true);
                toast.success(`Your Request for the book ${book.title} has been receivd. Wait for some time to get the confirmation`)
            }catch(error){
                console.error("Error:",error)
            }
            
            
            
        }else{
            console.log("Downloading the book");
        }
        

    }

    const handleShare = () => {
        // In a real application, you would implement sharing functionality
        toast.success("The link to this book has been copied to your clipboard")

    }

    return (
        <div className="min-h-screen bg-background">
            {loading ? (
                <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <BookOpen className="h-24 w-24 text-gray-500 animate-pulse" />
                </div>
            ) : (
                <>
                    <main className="container px-4 py-8">
                        {/* Breadcrumb */}
                        <nav className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
                            <Link href="/dashboard" className="hover:text-foreground">
                                Home
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/dashboard/borrow-book" className="hover:text-foreground">
                                Books
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground">{book.title}</span>
                        </nav>

                        {/* Product Section */}
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Image Gallery */}
                            <div className="space-y-4">
                                <motion.div
                                    className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={book.image}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 h-full w-full"
                                        >
                                            <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="space-y-2"
                                >
                                    <h1 className="text-3xl font-bold">{book.title}</h1>
                                    <p className="text-lg text-muted-foreground">by {book.author}</p>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i < Math.floor(book.ratings) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">({book.ratings} reviews)</span>
                                    </div>
                                    <Badge variant="secondary" className="mt-2">
                                        {book.genre}
                                    </Badge>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center space-x-4">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center space-x-2">
                                                        {book.availableCopies>0?<BookOpen className="h-5 w-5 text-green-500" />:<AlertCircle className="h-5 w-5 text-red-500" />}
                                                        <span className="font-medium">{book.availableCopies>0?"Available":"Not Available"}</span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{book.availableCopies} copies available</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        {book.availableCopies>0 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center space-x-2">
                                                            <Clock className="h-5 w-5 text-blue-500" />
                                                            <span className="font-medium">Est. Return: &nbsp; {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Estimated return date for borrowed copies</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>

                                    <div className="flex space-x-4">
                                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="physical">Physical Book</SelectItem>
                                                <SelectItem value="ebook">E-Book</SelectItem>
                                               
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={handleBorrow} disabled={isRequested && selectedFormat=="physical"}>{isRequested && selectedFormat=="physical"?text.length>0?text:"requested":selectedFormat=="physical"?"Borrow":"Download"}</Button>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button onClick={handleWishlist} variant={isWishlisted ? "default" : "outline"}>
                                            <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                                            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                                        </Button>
                                        <Button variant="outline" onClick={handleShare}>
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Share
                                        </Button>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <Tabs defaultValue="description">
                                        <TabsList>
                                            <TabsTrigger value="description">Description</TabsTrigger>
                                            <TabsTrigger value="details">Book Details</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="description" className="space-y-4 mt-4">
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
                                    </Tabs>
                                </motion.div>
                            </div>
                        </div>
                    </main>
                </>
            )}

        </div>
    )
}

