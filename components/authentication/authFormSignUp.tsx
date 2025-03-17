"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

export function AuthFormSignUp() {
  const emailRegex = /^[a-zA-Z]+\.(1[7-9]|2[0-4])(bce|bca|bcb|bba|bme|bec|mic|mis|phd)\d{4,5}@vitapstudent\.ac\.in$/;
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !name || !category || selectedGenres.length === 0) {
      toast.error("All fields are required!")
      return
    }
    const extractId = (email: string): string | null => {
      const regex = /\.(\d{2}(?:bce|bca|bcb|bba|bme|bec|mic|mis|phd)\d{4})@/;
      const match = email.match(regex);
      return match ? match[1] : null;
    }
    let regNumber = extractId(email);
    regNumber = regNumber ? regNumber.toUpperCase() : null;

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name,regNumber, category, genres: selectedGenres }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error === "User already exists") {
          toast.error("User already exists!")
        } else {
          toast.error("Signup failed")
        }
        throw new Error("Signup failed")
      }

      const data = await response.json()

      toast.success("Signup successful!")
      console.log("Signup successful:", data)

      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error signing up:", error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  const handleNextStep = () => {
    if (!email || !password || !name || !category) {
      toast.error("All fields are required!")
      return
    }
    if (!emailRegex.test(email)) {
      toast.error("Invaled email format! Use your VIT-AP student email.");
      setEmail("");
      return;
    }

    setStep(2)
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Thriller",
    "Horror",
    "Biography",
    "History",
  ]

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <motion.div initial="hidden" animate="visible" variants={formVariants}>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="category">Role</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue className="text-slate-300" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full transition-all duration-200 hover:bg-primary/90"
                >
                  Next
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>Select your favorite book genres</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre}
                        type="button"
                        variant={selectedGenres.includes(genre) ? "default" : "outline"}
                        onClick={() => toggleGenre(genre)}
                        className="transition-all duration-200"
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </motion.div>
                <Button type="submit" className="w-full transition-all duration-200 hover:bg-primary/90">
                  Sign Up
                </Button>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <motion.div variants={itemVariants} className="w-full text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Sign in
              </Link>
            </span>
          </motion.div>
        </CardFooter>
      </motion.div>
    </Card>
  )
}

