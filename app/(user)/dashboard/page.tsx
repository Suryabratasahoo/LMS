"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Clock,
  FileSpreadsheet,
  Users,
  Book,
  BookOpen,
  RefreshCcw,
  PlusCircle,
  History,
  Wallet,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import DashboardHeader from "./components/DashboardHeader"
import DashboardCard from "./components/DashboardCard"

const quickActions = [
  { label: "Library Notices", icon: Bell, color: "bg-blue-500", href: "/dashboard/library-notices" },
  { label: "View Borrowing History", icon: History, color: "bg-purple-500", href: "/dashboard/borrowing-history" },
  { label: "View Most Borrowed", icon: TrendingUp, color: "bg-red-500",href: "/dashboard/most-borrowed" },
  { label: "View/Pay Fines", icon: Wallet, color: "bg-purple-500", href: "/dashboard/fines" },
]

interface Notification{
  _id:string;
  message:string;
  type:string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userName, setUserName] = useState("")
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
  const router=useRouter();
  const topBooks = ["The Great Gatsby", "To Kill a Mockingbird", "1984", "Pride and Prejudice"]

  const borrowingData = [
    {
      month: "June",
      "The Great Gatsby": 65,
      "To Kill a Mockingbird": 50,
      "1984": 45,
      "Pride and Prejudice": 40,
    },
    {
      month: "July",
      "The Great Gatsby": 68,
      "To Kill a Mockingbird": 72,
      "1984": 48,
      "Pride and Prejudice": 35,
    },
    {
      month: "August",
      "The Great Gatsby": 70,
      "To Kill a Mockingbird": 60,
      "1984": 47,
      "Pride and Prejudice": 42,
    },
  ]

  useEffect(() => {

      const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}")
      setUserName(userDetails.name)


    async function fetchUserDetails() {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const user = await response.json()
          setUserName(user.name)
          localStorage.setItem("userDetails", JSON.stringify(user))
        } else {
          toast.error("Failed to fetch user details")
        }
      } catch (error) {
        console.error(error)
        toast.error("Error fetching user details")
      }
    }
    async function fethchNotifications(){
      try{
        const response=await fetch(`/api/notifications?userId=${userDetails._id}`);
        if(!response.ok){
          throw new Error("Failed to fetch notifications");
        }
        const notifications=await response.json();
        console.log(notifications);
        setRecentNotifications(notifications);
      }catch(error){
        console.error("Failed to fetch notifications");
      }
    }

    fetchUserDetails()
    fethchNotifications();
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {recentNotifications.map((notification) => (
                <DropdownMenuItem key={notification._id}>
                  <span>{notification.message}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {quickActions.map((action, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Button
                    variant="outline"
                    className="w-full h-32 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push(action.href)}
                  >
                    <action.icon size={36} />
                    <span>{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
              Overview
            </Button>
            <Button variant={activeTab === "tasks" ? "default" : "outline"} onClick={() => setActiveTab("tasks")}>
              My Tasks
            </Button>
          </div>

          {activeTab === "overview" && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <DashboardCard
                  title="View Books"
                  description="Access and review your preferred books"
                  icon={Book}
                  href="/dashboard/books"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DashboardCard
                  title="Borrow Book"
                  description="Request a book for borrowing"
                  icon={BookOpen}
                  href="/dashboard/borrow-book"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DashboardCard
                  title="Return Book"
                  description="Return a borrowed book"
                  icon={RefreshCcw}
                  href="/dashboard/return-book"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DashboardCard
                  title="Request a New Book"
                  description="Suggest a new book for the library"
                  icon={PlusCircle}
                  href="/dashboard/request-book"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="col-span-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Most Borrowed Books (Past 3 Months)</CardTitle>
                    <CardDescription>Trend of popular books over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={borrowingData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {topBooks.map((book, index) => (
                          <Line
                            key={book}
                            type="monotone"
                            dataKey={book}
                            stroke={`hsl(${index * 60}, 70%, 50%)`}
                            activeDot={{ r: 8 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants} className="col-span-full mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Borrowing Trend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Based on the graph above, we can observe the following trends:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>
                        "The Great Gatsby" has consistently been the most borrowed book over the past three months,
                        showing a slight increase in popularity.
                      </li>
                      <li>
                        "To Kill a Mockingbird" saw a significant spike in borrowing during July, possibly due to summer
                        reading programs.
                      </li>
                      <li>
                        "1984" has maintained a steady borrowing rate, indicating its enduring popularity among readers.
                      </li>
                      <li>
                        "Pride and Prejudice" shows some fluctuation in borrowing rates, with a noticeable dip in July
                        followed by a recovery in August.
                      </li>
                    </ul>
                    <p className="mt-4">
                      These trends can help inform library acquisition decisions and guide recommendations for readers.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Your current tasks and to-dos</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-2">
                    <Input type="checkbox" id="task1" className="w-4 h-4" />
                    <Label htmlFor="task1">Return "The Catcher in the Rye" by next week</Label>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Input type="checkbox" id="task2" className="w-4 h-4" />
                    <Label htmlFor="task2">Attend book club meeting on Friday</Label>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Input type="checkbox" id="task3" className="w-4 h-4" />
                    <Label htmlFor="task3">Write review for "The Alchemist"</Label>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>You borrowed "The Great Gatsby" yesterday</span>
              </li>
              <li className="flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5" />
                <span>Your book review for "To Kill a Mockingbird" was approved</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="h-5 w-5 " />
                <span>Your Request for "Ninja Hattori" is approved</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

