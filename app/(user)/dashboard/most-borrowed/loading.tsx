import { BookOpen } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <BookOpen className="h-16 w-16 text-gray-500 animate-pulse" />
    </div>
  )
}
