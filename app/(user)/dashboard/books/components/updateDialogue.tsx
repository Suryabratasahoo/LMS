import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { toast } from "react-hot-toast"

export function UpdateDialogue({
  open,
  onOpenChange,
  data,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: {
    comment: string
    rating?: number
    reviewId?: string
  }
}) {
  const [comment, setComment] = useState(data.comment)
  const [rating, setRating] = useState(data.rating || 0)
  const [reviewId, setReviewId] = useState(data.reviewId)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update state when data prop changes
  useEffect(() => {
    setComment(data.comment)
    setRating(data.rating || 0)
    setReviewId(data.reviewId)
  }, [data])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    if (!rating) {
      toast.error("Please select a rating")
      setIsSubmitting(false)
      return
    }

    if (!comment.trim()) {
      toast.error("Please write a review")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/Review?reviewId=${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          comment
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update review')
      }

      toast.success("Review updated successfully")
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Review</DialogTitle>
          <DialogDescription>
            Modify your review and rating for this book.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-none text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Review</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Updating..." : "Update Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}