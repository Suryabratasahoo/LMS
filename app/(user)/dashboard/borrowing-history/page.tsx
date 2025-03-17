"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon,BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Book{
  _id:string;
  title:string;
  author:string;
}


interface BorrowedBook {
  _id: string
  book:Book;
  borrow_date: string;
  return_date: string | null;
  status:string;
  due_date:string;
}

export default function BorrowingHistoryPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
    // In a real application, this would be an API call
    const fetchBorrowingHistory = async () => {
      try{
        const response=await fetch(`/api/borrowedBooks?userId=${userDetails._id}`);
        const data=await response.json();
        console.log(data);
        setBorrowedBooks(data);
        setLoading(false);
    
      }catch(error){
        console.error(error);
      }
      // Simulating an API call with setTimeout
    //   setTimeout(() => {
    //     const dummyHistory: BorrowedBook[] = [
    //       {
    //         id: "1",
    //         title: "The Great Gatsby",
    //         author: "F. Scott Fitzgerald",
    //         borrowDate: "2023-05-01",
    //         returnDate: "2023-05-15",
    //       },
    //       { id: "2", title: "To Kill a Mockingbird", author: "Harper Lee", borrowDate: "2023-05-10", returnDate: null },
    //       { id: "3", title: "1984", author: "George Orwell", borrowDate: "2023-04-20", returnDate: "2023-05-04" },
    //       {
    //         id: "4",
    //         title: "Pride and Prejudice",
    //         author: "Jane Austen",
    //         borrowDate: "2023-05-05",
    //         returnDate: "2023-05-19",
    //       },
    //       {
    //         id: "5",
    //         title: "The Catcher in the Rye",
    //         author: "J.D. Salinger",
    //         borrowDate: "2023-05-15",
    //         returnDate: null,
    //       },
    //     ]
    //     setBorrowedBooks(dummyHistory)
    //     setLoading(false);
    //   }, 1000)
    }

    fetchBorrowingHistory()
  }, [])

  const filteredBooks = date? borrowedBooks.filter((book) => format(parseISO(book.borrow_date), "PPP") === format(date, "PPP")) : borrowedBooks

  return (
    <div className="container mx-auto px-4 py-8">
        {loading ? (
        <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BookOpen className="h-24 w-24 text-gray-500 animate-pulse" />
        </div>
      ) : (
        <>
            <h1 className="text-3xl font-bold mb-6">Borrowing History</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[280px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Books Borrowed</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book._id}>
                  <TableCell className="font-medium">{book.book.title}</TableCell>
                  <TableCell>{book.book.author}</TableCell>
                  <TableCell>{format(parseISO(book.borrow_date), "PPP")}</TableCell>
                  <TableCell>{book.return_date ? format(parseISO(book.return_date), "PPP") : "Not returned"}</TableCell>
                  <TableCell>
                    {book.status=="Borrowed" ? (
                      <span className="text-yellow-600">Borrowed</span>
                      
                    ) : (
                      <span className="text-green-600">Returned</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

        </>
      )}
          </div>
  )
}

