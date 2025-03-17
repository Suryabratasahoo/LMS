"use client"

import { useState, useEffect } from "react"
import { TrendingUp, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MostBorrowedBook {
  _id: string
  title: string
  author: string
  borrowCount: number
  genre: string
  availableCopies: number
  totalCopies: number
}

export default function MostBorrowedBooksPage() {
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState<MostBorrowedBook[]>([])
  const [loading, setLoading] = useState(true)

 useEffect(()=>{
  const fetchMostBorrowedBooks=async()=>{
    try{
      const response=await fetch("/api/mostBorrowed");
      if(!response.ok){
        throw new Error("Failed to fetch most borrowed books");
      }
      const data=await response.json();
      console.log(data);
      setMostBorrowedBooks(data);
      setLoading(false);
    }catch(error){
      console.error(error);
    }
  }
  fetchMostBorrowedBooks();
 },[])

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BookOpen className="h-24 w-24 text-gray-500 animate-pulse" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Most Borrowed Books</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mostBorrowedBooks.slice(0, 3).map((book, index) => (
              <Card key={book._id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">#{index + 1} Most Borrowed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{book.title}</div>
                  <p className="text-xs text-muted-foreground">by {book.author}</p>
                  <div className="mt-4">
                    <Progress value={(book.availableCopies / book.totalCopies) * 100} className="h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {book.availableCopies} of {book.totalCopies} copies available
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>All Most Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Borrow Count</TableHead>
                    <TableHead>Available Copies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mostBorrowedBooks.map((book) => (
                    <TableRow key={book._id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.genre}</TableCell>
                      <TableCell>{book.borrowCount}</TableCell>
                      <TableCell>
                        {book.availableCopies} / {book.totalCopies}
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
