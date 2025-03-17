"use client"

import { useState,useEffect } from "react"
import { Bell, Book, Calendar, Info, X,XCircle,CheckCircle,AlarmClock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {toast} from "react-hot-toast";
interface Notification {
  _id: number
  type: "Reminder" | "Rejection" | "Announcement" | "Approval" | "Overdue"
  message: string
  createdAt: string
  isRead: boolean
}



export default function NotificationsPage() {
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userId,setUserId]=useState("");

   


    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
        setUserId(userDetails._id);
        const fetchNotifications=async()=>{
            try{
                const response=await fetch(`/api/notifications?userId=${userDetails._id}`);
                if(!response.ok){
                    throw new Error("Failed to fetch notifications");
                }
                const data=await response.json();
                console.log(data);
                setNotifications(data);
            }catch(error){
                console.error(error);
            }
        }
        fetchNotifications();
    }, [])
  

  const markAsRead = (id: number) => {
    const setRead=async()=>{
        try{
            const response=await fetch(`/api/notifications?id=${id}`,{method:"PATCH"});
            if(!response.ok){
                throw new Error("Failed to mark notification as read");
            }
            toast.success("Notification marked as read");
        }catch(error){
            console.error(error);
        }
    }
    setRead();
    setNotifications(notifications.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif)))
  }

  const deleteNotification = (id: number) => {
    const deleteNoti=async()=>{
        try{
            const response=await fetch(`/api/notifications?id=${id}`,{method:"DELETE"});
            if(!response.ok){
                throw new Error("Failed to delete notification");
            }
            toast.success("Notification deleted");
        }catch(error){
            console.error(error);
        }
    }
    deleteNoti();
    setNotifications(notifications.filter((notif) => notif._id !== id))
  }

  

  

  const filterNotifications = (filter: "all" | "unread") => {
    return filter === "all" ? notifications : notifications.filter((notif) => !notif.isRead)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <NotificationList
            notifications={filterNotifications("all")}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        </TabsContent>
        <TabsContent value="unread">
          <NotificationList
            notifications={filterNotifications("unread")}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationList({
  notifications,
  markAsRead,
  deleteNotification,
}: {
  notifications: Notification[]
  markAsRead: (id: number) => void
  deleteNotification: (id: number) => void
}) {
    const getIcon = (type: Notification["type"]) => {
        switch (type) {
          case "Approval":
            return <CheckCircle className="h-4 w-4" />
          case "Rejection":
            return <XCircle className="h-4 w-4" />
          case "Announcement":
            return <Bell className="h-4 w-4" />
          case "Overdue":
            return <Info className="h-4 w-4" />
            case "Reminder":
                return <AlarmClock className="h-4 w-4"/>
        }
    }

    const getColor = (type: Notification["type"]) => {
        switch (type) {
          case "Reminder":
            return "bg-yellow-100 text-yellow-800"
          case "Approval":
            return "bg-green-100 text-green-800"
          case "Announcement":
            return "bg-blue-100 text-blue-800"
          case "Overdue":
            return "bg-red-100 text-red-800"
          case "Rejection":
            return "bg-red-100 text-red-800"
        }
      }

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications to display.</p>
      ) : (
        notifications.map((notification) => (
          <Card key={notification._id} className={`mb-4 ${notification.isRead ? "opacity-60" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={getColor(notification.type)}>
                    {getIcon(notification.type)}
                    <span className="ml-1">{notification.type.replace("_", " ")}</span>
                  </Badge>
                  <span>{notification.type}</span>
                </div>
              </CardTitle>
              <X
                className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => deleteNotification(notification._id)}
              />
            </CardHeader>
            <CardContent>
              <CardDescription>{notification.message}</CardDescription>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                    <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                    <span>{new Date(notification.createdAt).toLocaleTimeString()}</span>
                </div>
                
                {!notification.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(notification._id)}>
                    Mark as read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </ScrollArea>
  )
}

