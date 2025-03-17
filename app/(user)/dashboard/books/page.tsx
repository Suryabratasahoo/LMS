"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Book, BookOpen, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BooksPage() {
  const router = useRouter();
  const [rated, setRated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    image?: string;
  }

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/fetchBooks");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setBooks(data); // Set books from API response
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search & genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  interface HandleViewDetails {
    (bookId: string): void;
  }

  const handleViewDetails: HandleViewDetails = (bookId) => {
    router.push(`/dashboard/books/${bookId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BookOpen className="h-24 w-24 text-gray-500 animate-pulse" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Library Books</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="science fiction">Science Fiction</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={rated ? "default" : "outline"}
              className={rated ? "bg-black text-white border-black" : "bg-transparent"}
              onClick={() => setRated(!rated)}
            >
              <Star className="h-4 w-4 mr-2" />
              Top Rated
            </Button>
          </div>

          {/* Book Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <Card key={book._id} className="flex flex-col overflow-hidden">
                  <div className="relative h-96 w-full">
                    <Image
                      src={book.image || "/bookshelf.jpg"}
                      alt={book.title}
                      layout="fill"
                      objectFit=""
                      className="transition-transform duration-300 ease-in-out hover:scale-105 object-"
                    />
                  </div>
                  <CardContent className="flex-grow p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <Badge variant="secondary">{book.genre}</Badge>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full" onClick={() => handleViewDetails(book._id)}>
                      <Book className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">No books found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
