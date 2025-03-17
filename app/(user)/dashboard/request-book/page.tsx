"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {toast} from "react-hot-toast"

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string().min(2, { message: "Author must be at least 2 characters." }),
  isbn: z.string().regex(/^(?:\d{10}|\d{13})$/, { message: "ISBN must be 10 or 13 digits." }),
  genre: z.string({ required_error: "Please select a genre." }),
  reason: z.string().min(10, { message: "Reason must be at least 10 characters." }).max(500, { message: "Reason must not exceed 500 characters." }),
})

export default function RequestBookPage() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId,setUserId]=useState("")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", author: "", isbn: "", genre: "", reason: "" },
  })
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
    setUserId(userDetails._id);
  }, [])
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Hello I am here");
    setIsSubmitting(true)
    
    console.log(values);
    try{
      const response=await fetch('/api/request-book',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({...values,user:userId})
      })
      if(!response.ok){
        throw new Error("An error occurred while submitting the request.")
      }
      toast.success("Request submitted successfully.")
      form.reset();
    }catch(error){
      toast.error((error as Error).message)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-full fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Request a New Book</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Book Title</FormLabel>
                <FormControl><Input placeholder="Enter the book title" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="author" render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl><Input placeholder="Enter the author's name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="isbn" render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl><Input placeholder="Enter the ISBN" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="genre" render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a genre" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="fiction">Fiction</SelectItem>
                    <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                    <SelectItem value="science-fiction">Science Fiction</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="biography">Biography</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="self-help">Self-Help</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="reason" render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Request</FormLabel>
                <FormControl><Textarea placeholder="Why do you think this book should be added?" className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <><Book className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><Book className="mr-2 h-4 w-4" /> Submit Request</>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
