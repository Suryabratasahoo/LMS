"use client"

import { useEffect, useState } from "react"
import { Book, BookPlus, Bell, Users, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { NewBookRequestDialog } from "./new-book-request-dialog"
import { AnnouncementDialog } from "./announcement-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-hot-toast"
// Mock data for borrow requests




// Mock data for new book requests

// Mock data for borrowing analytics
const borrowingData = [
  { week: "Week 1", borrows: 45 },
  { week: "Week 2", borrows: 52 },
  { week: "Week 3", borrows: 49 },
  { week: "Week 4", borrows: 63 },
  { week: "Week 5", borrows: 58 },
  { week: "Week 6", borrows: 64 },
]
interface Book {
  _id: string;
  title: string;
  author:string;
}
interface User {
  _id: string;
  name: string;
  regNumber: string;
}
export interface BorrowRequest {
  _id: string;
  book: Book,
  user: User,
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface NewBookRequest{
  _id:string;
  book:Book
  createdAt:Date;
  user:User;
}
export interface ReturnRequest{
  _id:string;
  book:Book;
  user:User;
  status:string;
  fine:number;
  createdAt:Date;
}

export default function AdminDashboard() {
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [returnRequests,setReturnRequests]=useState<ReturnRequest[]>([])
  const [newBookRequests,setNewBookRequests]=useState<NewBookRequest[]>([]);
  const [isNewBookDialogOpen, setIsNewBookDialogOpen] = useState(false)
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false)
  const handleAction = (id: string, action: string, userId: string) => async () => {
    console.log(id, action);
    try {
      const response = await fetch(`/api/borrow-request?action=${action}&id=${id}&userId=${userId}`, {
        method: "PATCH"
      })
      if (!response.ok) {
        throw new Error("Error while lending the book");
      }
      const data = await response.json();
      setBorrowRequests(borrowRequests.filter((request) => request._id !== id));
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  }
  const handleNew=(id:string,action:string,userId:string,title:string)=>async()=>{
    console.log(id,action);
    try{
      const response=await fetch(`/api/new-book-request?action=${action}&id=${id}&userId=${userId}&title=${title}`,{
        method:"PATCH"
      })
      if (!response.ok) {
        throw new Error("Error while accepting request");
      }
      const data = await response.json();
      setNewBookRequests(newBookRequests.filter((request) => request._id !== id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error);
    }
  }
  const handleReturn=(id:string,userId:string,bookId:string)=>async()=>{
    console.log(id,userId,bookId);
    try{
      const response=await fetch(`/api/return-request?id=${id}&userId=${userId}&bookId=${bookId}`,{
        method:"PATCH",
      })
      if(!response.ok){
        throw new Error("Error while accepting request");
      }
      toast.success("Book has been returned");
      setReturnRequests(returnRequests.filter((request)=>request._id!==id));
    }catch(error){
      toast.error("Error while accepting Book");
    }
  }
  useEffect(() => {
    const fetchBorrowRequests = async () => {
      try {
        const response = await fetch("/api/borrow-request");
        if (!response.ok) {
          throw new Error("Failed to fetch borrow requests");
        }
        const data = await response.json();
        console.log(data);
        setBorrowRequests(data);

      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    }
    const fetchNewBookRequests=async()=>{
      try{
        const response=await fetch("/api/new-book-request");
        if(!response.ok){
          throw new Error("Failed to fetch new book requests");
        }
        const data=await response.json();
        console.log(data);
        setNewBookRequests(data);
      }catch(error){
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    }
    const fetchReturnRequests=async()=>{
      try{
        console.log("Hello I am here");
        const response=await fetch("/api/return-request");
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
    fetchBorrowRequests();
    fetchNewBookRequests();
    fetchReturnRequests();
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+20 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Borrows</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+18 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-5 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Requests</CardTitle>
            <BookPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4 mb-6">
        <Button onClick={() => setIsNewBookDialogOpen(true)}>
          <BookPlus className="mr-2 h-4 w-4" /> New Book Request
        </Button>
        <Button onClick={() => setIsAnnouncementDialogOpen(true)}>
          <Bell className="mr-2 h-4 w-4" /> Make Announcement
        </Button>
      </div>

      <Tabs defaultValue="borrow-requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="borrow-requests">Borrow Requests</TabsTrigger>
          <TabsTrigger value="new-book-requests">New Book Requests</TabsTrigger>
          <TabsTrigger value="return-requests">Return Book Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="borrow-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Borrow Requests</CardTitle>
              <CardDescription>Manage pending borrow requests</CardDescription>
            </CardHeader>
            {borrowRequests.length===0?(
          <CardDescription className="text-center text-4xl flex justify-center items-center gap-3 pb-24"><img className="w-10 h-10" src="/no.gif" alt="" />No Borrow Requests</CardDescription>
            ):(<CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.user.regNumber}</TableCell>
                      <TableCell>{request.user.name}</TableCell>
                      <TableCell>{request.book.title}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button onClick={handleAction(request._id, "approve", request.user._id)} variant="outline" size="sm" className="mr-2">
                          Approve
                        </Button>
                        <Button onClick={handleAction(request._id, "reject", request.user._id)} variant="outline" size="sm">
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>)}
            
          </Card>
        </TabsContent>
        <TabsContent value="new-book-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Book Requests</CardTitle>
              <CardDescription>Review and approve new book requests</CardDescription>
            </CardHeader>
            {newBookRequests.length===0?(<CardDescription className="text-center text-4xl flex justify-center items-center gap-3 pb-24"><img className="w-10 h-10" src="/no.gif" alt="" />No New Book Requests</CardDescription>):(
              <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newBookRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.user.regNumber}</TableCell>
                      <TableCell>{request.book.title}</TableCell>
                      <TableCell>{request.book.author}</TableCell>
                      <TableCell>{request.user.name}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button onClick={handleNew(request._id,"approve",request.user._id,request.book.title)} variant="outline" size="sm" className="mr-2">
                          Approve
                        </Button>
                        <Button onClick={handleNew(request._id,"rejected",request.user._id,request.book.title)} variant="outline" size="sm">
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            )}
            
          </Card>
        </TabsContent>
        <TabsContent value="return-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Return Book Requests</CardTitle>
              <CardDescription>Manage Return Book Requests</CardDescription>
            </CardHeader>
            {returnRequests.length===0?(<CardDescription className="text-center text-4xl flex justify-center items-center gap-3 pb-24"><img className="w-10 h-10" src="/no.gif" alt="" />No Return Requests</CardDescription>):(
                          <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Book</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Fine</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {returnRequests.map((request) => (
                                <TableRow key={request._id}>
                                  <TableCell>{request.user.regNumber}</TableCell>
                                  <TableCell>{request.user.name}</TableCell>
                                  <TableCell>{request.book.title}</TableCell>
                                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                                  <TableCell>{request.fine}</TableCell>
                                  <TableCell>
                                    <Button onClick={handleReturn(request._id, request.user._id,request.book._id)} variant="outline" size="sm" className="mr-2">
                                      Approve
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
            )}

          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Borrowing Analytics</CardTitle>
              <CardDescription>Number of books borrowed per week</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={borrowingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="borrows" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NewBookRequestDialog open={isNewBookDialogOpen} onOpenChange={setIsNewBookDialogOpen} />
      <AnnouncementDialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen} />
    </div>  
  )
}


