"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Trash2, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea"

interface Book {
    _id: number
    title: string
    author: string
    description:string
    image:string
    publisher:string
    language:string
    paperback:number
    isbn: string
    genre:string
    totalCopies:number
    availableCopies: number
    price:number
    ratings:number
}


export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [editingBook, setEditingBook] = useState<Book | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeletingBook, setIsDeletingBook] = useState<Book | null>(null)

    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.includes(searchTerm),
    )

    const handleEdit = (book: Book) => {
        setEditingBook(book)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (id: number) => {
        setBooks(books.filter((book) => book._id !== id))
        toast({
            title: "Book Deleted",
            description: "The book has been successfully removed from the library.",
        })
    }
    const handleDeleteConfirm = () => {

        const deleteBook=async()=>{
            if(isDeletingBook){
                console.log(isDeletingBook._id)
                try{
                    const response=await fetch(`/api/updateBook?bookId=${isDeletingBook._id}`,{
                        method:'DELETE',
                    })
                    if(!response.ok){
                        throw new Error("Failed to delete book")
                    }
                    toast.success("The book has been successfully removed from the library.")
                }catch(error){
                    toast.error("Failed to delete book")
                }
                
            }
            
        }
        deleteBook();
        if (isDeletingBook) {
          setBooks(books.filter((book) => book._id !== isDeletingBook._id))
          setIsDeletingBook(null)
        }
      }
      const handleDeleteClick = (book: Book) => {
        setIsDeletingBook(book)
      }

    const handleSaveEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const saveEdit=async()=>{
            try{
                const response=await fetch('/api/updateBook',{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(editingBook)
                })
                if(!response.ok){
                    throw new Error("Failed to update book")
                }
                toast.success("book updated successfully")
            }catch(error){
                toast.error("Failed to update book")
            }
        }
        saveEdit();
        if (editingBook) {
            setBooks(books.map((book) => (book._id === editingBook._id ? editingBook : book)))
            setIsEditDialogOpen(false)
            setEditingBook(null)
            toast({
                title: "Book Updated",
                description: "The book details have been successfully updated.",
            })
        }
    }
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("/api/fetchBooks");
                if (!response.ok) {
                    throw new Error('failed to fetch books');
                }
                const data = await response.json();
                setBooks(data);
            }catch(error){
                console.error(error);
            }
            
        }
    
        fetchBooks();
}, [])

return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Books</h1>

        <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                />
            </div>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Book
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
                <Card key={book._id} className="flex flex-col">
                    <CardHeader>
                        <div className="aspect-[3/4] relative mb-4">
                            <img
                                src={book.image || "/placeholder.svg"}
                                alt={`Cover of ${book.title}`}
                                className="object-cover rounded-md"
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                        <p className="text-sm mb-1">
                            <strong>ISBN:</strong> {book.isbn}
                        </p>
                        <p className="text-sm mb-1">
                            <strong>Ratings:</strong> {book.ratings}
                        </p>
                        <p className="text-sm">
                            <strong>Available:</strong> {book.availableCopies} copies
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(book)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button  onClick={() => handleDeleteClick(book)} variant="outline" size="sm" >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Edit Book</DialogTitle>
                    <DialogDescription>Make changes to the book details here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveEdit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={editingBook?.title}
                                onChange={(e) => setEditingBook(editingBook ? { ...editingBook, title: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="author" className="text-right">
                                Author
                            </Label>
                            <Input
                                id="author"
                                value={editingBook?.author}
                                onChange={(e) => setEditingBook(editingBook ? { ...editingBook, author: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isbn" className="text-right">
                                ISBN
                            </Label>
                            <Input
                                id="isbn"
                                value={editingBook?.isbn}
                                onChange={(e) => setEditingBook(editingBook ? { ...editingBook, isbn: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="publicationYear" className="text-right">
                                Ratings
                            </Label>
                            <Input
                                id="publicationYear"
                                type="number"
                                value={editingBook?.ratings?.toString() || ""}
                                onChange={(e) =>
                                    setEditingBook(
                                        editingBook ? { ...editingBook, ratings: Number.parseInt(e.target.value) } : null,
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="availableCopies" className="text-right">
                                Copies
                            </Label>
                            <Input
                                id="availableCopies"
                                type="number"
                                value={editingBook?.availableCopies?.toString() || ""}
                                onChange={(e) =>
                                    setEditingBook(
                                        editingBook ? { ...editingBook, availableCopies: Number.parseInt(e.target.value) } : null,
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="coverImage" className="text-right">
                                Cover URL
                            </Label>
                            <Input
                                id="coverImage"
                                value={editingBook?.image}
                                onChange={(e) => setEditingBook(editingBook ? { ...editingBook, image: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="coverImage" className="text-right">
                                Genre
                            </Label>
                            <Input
                                id="coverImage"
                                value={editingBook?.genre}
                                onChange={(e) => setEditingBook(editingBook ? { ...editingBook, genre: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="coverImage" className="text-right">
                                Price
                            </Label>
                            <Input
                                id="coverImage"
                                value={editingBook?.price?.toString() || ""}
                                onChange={(e) => setEditingBook(editingBook ? { ...editingBook, price: Number(e.target.value) } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="coverImage" className="text-right">
                                Price
                            </Label>
                            <Textarea
                                id="coverImage"
                                value={editingBook?.description}
                                onChange={(e) => setEditingBook(editingBook ? { ...editingBook, description: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        <Dialog open={isDeletingBook !== null} onOpenChange={() => setIsDeletingBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the book "{isDeletingBook?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletingBook(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
)
}

