"use client"

import { useState, useEffect } from "react"
import { format, isPast, addDays } from "date-fns"
import { ArrowLeftCircle, Calendar, Loader2 ,BookOpen} from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {toast} from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Book{
  _id:string;
  title:string;
  author:string;
  image:string;
}


interface BorrowedBook {
  _id: string
  book:Book;
  due_date: Date

}

interface ReturnRequest{
  book:string;
}

export default function ReturnBookPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [selectedBook, setSelectedBook] = useState<BorrowedBook | null>(null)
  const [loading, setLoading] = useState(true) // Added loading state
  const [userId,setUserId]=useState("");
  const [returnRequests,setReturnRequests]=useState<ReturnRequest[]>([]);


  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
    setUserId(userDetails._id);
    const fetchBorrowedBooks = async () => {
      try{
        const response=await fetch(`/api/borrowedBooks?userId=${userDetails._id}`);
        if(!response.ok){
          throw new Error("Failed to fetch most borrowed books");
        }
        const data=await response.json();
        console.log(data);
        setBorrowedBooks(data);
        setLoading(false);
      }catch(error){
        console.error(error);
      }
    }
    const fetchReturnRequests=async()=>{
      try{
        const response=await fetch(`/api/returnBook?userId=${userDetails._id}`);
        if(!response.ok){
          throw new Error("Failed to fetch return requests");
        }
        const data=await response.json();
        console.log(data);
        setReturnRequests(data);
      }catch(error){
        console.error(error);
      }
    }

    fetchBorrowedBooks();
    fetchReturnRequests();
  }, [])

  const calculateFine = (dueDate: Date) => {
    if (isPast(dueDate)) {
      const daysOverdue = Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 3600 * 24))
      if(daysOverdue>0){
        return daysOverdue * 0.5;
      }
      return 0;
    }
    return 0
  }

  const handleExtendDueDate = (book: BorrowedBook, days: number) => {
    const updatedBooks = borrowedBooks.map((b) => (b._id === book._id ? { ...b, due_date: addDays(b.due_date, days) } : b))
    setBorrowedBooks(updatedBooks)
    setSelectedBook(null)
  }

  const handleReturnBook = (bookId: string,due_date:Date) => {
    const handleReturn=async()=>{
      const fine=calculateFine(new Date(due_date));
      console.log(fine);
      console.log(userId);
      console.log(bookId);
      try{
        const response=await fetch(`/api/returnBook`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({bookId,userId,fine})
        })
        if(!response.ok){
          throw new Error("Failed to return book");
        }
        toast.success("Request for returning book has been sent successfully");
      }catch(error){
        toast.error("Error while sending request for returning book");
      }
    }
    const fetchReturnRequests=async()=>{
      try{
        const response=await fetch(`/api/returnBook?userId=${userId}`);
        if(!response.ok){
          throw new Error("Failed to fetch return requests");
        }
        const data=await response.json();
        console.log(data);
        setReturnRequests(data);
      }catch(error){
        console.error(error);
      }
    }
    handleReturn();
    fetchReturnRequests();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BookOpen className="h-24 w-24 text-gray-500 animate-pulse" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Return or Extend Books</h1>


          {borrowedBooks.length===0?(
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-500">No books borrowed yet</p>
            </div>
          ):(<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {borrowedBooks.map((book) => (
              <Card key={book._id} className="flex flex-col overflow-hidden">
                <div className="relative h-64 w-full">
                  <img
                    src={book.book.image || "/placeholder.svg"}
                    alt={book.book.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </div>
                <CardContent className="flex-grow p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.book.author}</p>
                  <p className="text-sm mb-2">Due: {format(book.due_date, "MMM dd, yyyy")}</p>
                  {isPast(book.due_date) && (
                    <Badge variant="destructive" className="mb-2">
                      Overdue - Fine: ${calculateFine(book.due_date).toFixed(2)}
                    </Badge>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button disabled={!!returnRequests.find((r)=>r.book===book.book._id)} variant="outline" onClick={() => handleReturnBook(book.book._id,book.due_date)}>
                    <ArrowLeftCircle className="h-4 w-4 mr-2" />{returnRequests.find((r)=>r.book===book.book._id)?"Requested":"Return"}

                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedBook(book)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Extend
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Extend Due Date</DialogTitle>
                        <DialogDescription>
                          Extend the due date for {selectedBook?.book.title}. Current due date:{" "}
                          {selectedBook && format(selectedBook.due_date, "MMM dd, yyyy")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="days" className="text-right">
                            Days to extend
                          </Label>
                          <Input id="days" defaultValue="7" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() => selectedBook && handleExtendDueDate(selectedBook, 7)}>
                          Extend Due Date
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>)}
          

        </>
      )}

    </div>
  )
}
