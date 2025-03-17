"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Wallet, CreditCard, AlertCircle,BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface Fine {
  id: string
  bookTitle: string
  amount: number
  reason: string
  date: string
  status: "Unpaid" | "Paid"
}

export default function FinePage() {
  const [fines, setFines] = useState<Fine[]>([])
  const [totalUnpaidFines, setTotalUnpaidFines] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState("")
    const [loading, setLoading] = useState(true)
  useEffect(() => {
    // In a real application, this would be an API call
    const fetchFines = async () => {
      // Simulating an API call with setTimeout
      setTimeout(() => {
        const dummyFines: Fine[] = [
          {
            id: "1",
            bookTitle: "The Great Gatsby",
            amount: 2.5,
            reason: "Late return",
            date: "2023-05-15",
            status: "Unpaid",
          },
          {
            id: "2",
            bookTitle: "To Kill a Mockingbird",
            amount: 1.0,
            reason: "Damaged book",
            date: "2023-05-20",
            status: "Unpaid",
          },
          { id: "3", bookTitle: "1984", amount: 3.0, reason: "Late return", date: "2023-05-10", status: "Paid" },
          {
            id: "4",
            bookTitle: "Pride and Prejudice",
            amount: 2.0,
            reason: "Late return",
            date: "2023-05-05",
            status: "Paid",
          },
        ]
        setFines(dummyFines)
        const unpaidTotal = dummyFines
          .filter((fine) => fine.status === "Unpaid")
          .reduce((total, fine) => total + fine.amount, 0)
        setTotalUnpaidFines(unpaidTotal)
        setLoading(false);
      }, 1000)
    }

    fetchFines()
  }, [])

  const handlePayment = () => {
    const amount = Number.parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid payment amount.")
      
      return
    }

    if (amount > totalUnpaidFines) {
        toast.error("The payment amount exceeds the total unpaid fines.")
      
      return
    }

    // In a real application, this would be an API call to process the payment
    setTotalUnpaidFines((prevTotal) => prevTotal - amount)
    setFines((prevFines) => prevFines.map((fine) => (fine.status === "Unpaid" ? { ...fine, status: "Paid" } : fine)))

    toast.success(`You have successfully paid $${amount.toFixed(2)}.`)

    setPaymentAmount("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
        {loading ? (
        <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BookOpen className="h-24 w-24 text-gray-500 animate-pulse" />
        </div>
      ) : (
        <>
            <h1 className="text-3xl font-bold mb-6">Fines and Payments</h1>

<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Unpaid Fines</CardTitle>
      <Wallet className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${totalUnpaidFines.toFixed(2)}</div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Pay Fines</CardTitle>
      <CardDescription>Enter the amount you want to pay</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          placeholder="Amount"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
        <Button onClick={handlePayment}>Pay</Button>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
      <CreditCard className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p>Credit Card, Debit Card, Cash</p>
    </CardContent>
    <CardFooter>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Payment Method</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Enter your card details to add a new payment method.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardNumber" className="text-right">
                Card Number
              </Label>
              <Input id="cardNumber" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">
                Expiry Date
              </Label>
              <Input id="expiryDate" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvv" className="text-right">
                CVV
              </Label>
              <Input id="cvv" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Payment Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardFooter>
  </Card>
</div>

<Card>
  <CardHeader>
    <CardTitle>Fine History</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fines.map((fine) => (
          <TableRow key={fine.id}>
            <TableCell className="font-medium">{fine.bookTitle}</TableCell>
            <TableCell>${fine.amount.toFixed(2)}</TableCell>
            <TableCell>{fine.reason}</TableCell>
            <TableCell>{format(new Date(fine.date), "MMM dd, yyyy")}</TableCell>
            <TableCell>
              {fine.status === "Paid" ? (
                <span className="text-green-600">Paid</span>
              ) : (
                <span className="text-red-600">Unpaid</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>

<Card className="mt-8">
  <CardHeader className="flex flex-row items-center space-x-2">
    <AlertCircle className="h-6 w-6 text-yellow-500" />
    <CardTitle>Fine Policy</CardTitle>
  </CardHeader>
  <CardContent>
    <ul className="list-disc pl-5 space-y-2">
      <li>Late returns are charged at $0.25 per day.</li>
      <li>Damaged books are assessed individually, with fines starting at $1.00.</li>
      <li>Lost books are charged at the full replacement cost plus a $5.00 processing fee.</li>
      <li>Fines must be paid before borrowing additional items.</li>
      <li>
        If your total fines exceed $10.00, your borrowing privileges will be suspended until payment is made.
      </li>
    </ul>
  </CardContent>
</Card>

        </>
      )}
          </div>
  )
}

