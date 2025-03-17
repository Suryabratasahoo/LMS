"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronRight, Search,Loader2,BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {toast} from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Notice {
  id: string
  title: string
  date: Date
  category: string
  description: string
  fullContent: string
}

export default function LibraryNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)

  const [loading,setLoading] = useState(true)
  
  useEffect(() => {
      const fetchNotices=async()=>{
        try{
          const response=await fetch('/api/notice',{
            method:'GET',
          });
          if(!response.ok){
            throw new Error("Something went wrong!");
          }
          const data=await response.json();
          const formattedData=data.map((notice:any)=>({
            id:notice._id,
            title:notice.title,
            date:new Date(notice.createdAt),
            category:notice.type,
            description:notice.description,
            fullContent:notice.description
          }))
          setNotices(formattedData);
          setLoading(false);
          console.log(data);
        }catch(error){
          toast.error("Failed to fetch notices");
        }
      }
      fetchNotices();
  }, [])

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
        {loading ? (
        <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BookOpen className="h-24 w-24 text-gray-500 animate-pulse" />
        </div>
      ) : (
        <>
        <h1 className="text-3xl font-bold mb-6">Library Notices</h1>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
        <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <CardTitle>{notice.title}</CardTitle>
                  <CardDescription>{format(notice.date, "MMMM d, yyyy")}</CardDescription>
                </div>
                <Badge variant="secondary">{notice.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>{notice.description.length>50?`${notice.description.slice(0,50)}...`:notice.description}</p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedNotice(notice)}>
                    Read More <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedNotice?.title}</DialogTitle>
                    <DialogDescription>
                      {selectedNotice && format(selectedNotice.date, "MMMM d, yyyy")}
                    </DialogDescription>
                  </DialogHeader>
                  <p className="mt-4">{selectedNotice?.fullContent}</p>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
        </>
      )}
      
     
      
    </div>
  )
}

