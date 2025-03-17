"use client"

import { useState } from "react"
import { User, Mail, Phone, CreditCard, Plus, Trash2, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-hot-toast"

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
}

// Mock saved payment methods
const mockPaymentMethods = [
  { id: 1, type: "Visa", last4: "4242", expiry: "12/24" },
  { id: 2, type: "Mastercard", last4: "5555", expiry: "10/25" },
]

// Mock fines and disciplinary points
const mockFines = [
  { id: 1, amount: 5.0, reason: "Late return", date: "2023-05-15" },
  { id: 2, amount: 2.5, reason: "Damaged book", date: "2023-06-02" },
]

const mockDisciplinaryPoints = [
  { id: 1, points: 1, reason: "Noise complaint", date: "2023-05-20" },
  { id: 2, points: 2, reason: "Late return of reserved book", date: "2023-06-10" },
]

// Mock reading history and recommendations
const mockReadingHistory = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", date: "2023-04-15" },
  { id: 2, title: "1984", author: "George Orwell", date: "2023-05-01" },
]

const mockRecommendations = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 2, title: "Pride and Prejudice", author: "Jane Austen" },
]

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prevUser) => ({ ...prevUser, [name]: value }))
  }

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully")
    setIsEditing(false)
  }

  const handleAddPaymentMethod = () => {
    toast.success("New payment method added")
  }

  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods((prevMethods) => prevMethods.filter((method) => method.id !== id))
    toast.success("Payment method removed")
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="personal" className="space-y-4 w-full max-w-4xl">
        <div className="w-full flex justify-center">
        <TabsList className="flex justify-center">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="fines">Fines & Points</TabsTrigger>
          <TabsTrigger value="reading">Reading History</TabsTrigger>
        </TabsList>
        </div>
        

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<User className="h-4 w-4 text-gray-500" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<Mail className="h-4 w-4 text-gray-500" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<Phone className="h-4 w-4 text-gray-500" />}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              {isEditing ? (
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {paymentMethods.map((method) => (
                  <li key={method.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <span>
                        {method.type} ending in {method.last4}
                      </span>
                      <span className="text-sm text-gray-500">Expires {method.expiry}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemovePaymentMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddPaymentMethod}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="fines">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Fines</CardTitle>
                <CardDescription>Your current fines and fees</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {mockFines.map((fine) => (
                    <li key={fine.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">${fine.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{fine.reason}</p>
                      </div>
                      <span className="text-sm text-gray-500">{fine.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-semibold">
                  Total: ${mockFines.reduce((sum, fine) => sum + fine.amount, 0).toFixed(2)}
                </p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disciplinary Points</CardTitle>
                <CardDescription>Your current disciplinary record</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {mockDisciplinaryPoints.map((point) => (
                    <li key={point.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {point.points} point{point.points > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-gray-500">{point.reason}</p>
                      </div>
                      <span className="text-sm text-gray-500">{point.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-semibold">
                  Total Points: {mockDisciplinaryPoints.reduce((sum, point) => sum + point.points, 0)}
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reading">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Reading History</CardTitle>
                <CardDescription>Your recently borrowed books</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {mockReadingHistory.map((book) => (
                    <li key={book.id} className="flex items-center space-x-2">
                      <Book className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-sm text-gray-500">by {book.author}</p>
                      </div>
                      <span className="text-sm text-gray-500 ml-auto">{book.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your reading history</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {mockRecommendations.map((book) => (
                    <li key={book.id} className="flex items-center space-x-2">
                      <Book className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-sm text-gray-500">by {book.author}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline">See More Recommendations</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

