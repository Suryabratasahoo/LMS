'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle,CardFooter } from '@/components/ui/card'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import toast from 'react-hot-toast'
import { storeTokenInCookies } from '@/lib/cookies';


interface AuthFormProps {
  type: 'signin' | 'signup'
}

interface CategorySubcategories {
  [key: string]: string[]
}

const categorySubcategories: CategorySubcategories = {
  teaching: ['Professor', 'Assistant Professor'],
  cleaning: ['Head', 'Worker'],
  security: ['Level 1', 'Level 2'],
  phd: ['Junior', 'Senior'],
  warden: ['MH-1', 'MH-2', 'MH-3', 'MH-4','MH-5','MH-6'] // Add more hostels as needed
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Reset subcategory when category changes
    setSubcategory('')
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(process.env.NEXT_PUBLIC_MONGODB_URI);
    // Check for missing fields
    if (!email || !password || !name || !category || !subcategory) {
      toast.error('All fields are required!');
      return;
    }
  
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, category, subcategory }),
      });
  
      if (!response.ok) {
        // Check if the user already exists
        const errorData = await response.json();
        if (errorData.error === 'User already exists') {
          toast.error('User already exists!');
        } else {
          toast.error('Signup failed');
        }
        throw new Error('Signup failed');
      }
  
      const data = await response.json();
      const { token } = data; // The JWT token returned from the server
  
      // Store the token in cookies instead of localStorage
      const responseWithToken = storeTokenInCookies(token);
      console.log(responseWithToken);
      // You can redirect or update the UI after storing the token
      toast.success('Signup successful!');
      console.log('Signup successful:', data);
  
      // Redirect or perform other actions
      window.location.href = '/dashboard'; // Redirect to the dashboard after successful signup
  
    } catch (error) {
      console.error('Error signing up:', error);
      // Optionally, show a generic error toast
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <CardHeader>
          <CardTitle>{type === 'signin' ? 'Sign In' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {type === 'signin'
              ? 'Enter your credentials to access your account'
              : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue className='text-slate-300' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teaching">Teaching Faculty</SelectItem>
                      <SelectItem value="cleaning">Cleaning Faculty</SelectItem>
                      <SelectItem value="security">Security Guards</SelectItem>
                      <SelectItem value="phd">PhD Scholars</SelectItem>
                      <SelectItem value="warden">Wardens</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                <AnimatePresence>
                  {category && (
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="space-y-2"
                    >
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select value={subcategory} onValueChange={setSubcategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorySubcategories[category]?.map((subcat) => (
                            <SelectItem key={subcat} value={subcat.toLowerCase().replace(' ', '-')}>
                              {subcat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {type === 'signin' && (
                  <Link href="/reset-password-confirmation" className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
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
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </motion.div>
            <Button type="submit" className="w-full transition-all duration-200 hover:bg-primary/90">
              {type === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {type === 'signin' && (
            <motion.div variants={itemVariants} className="w-full text-center">
              <span className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
                  Create an account
                </Link>
              </span>
            </motion.div>
          )}
        </CardFooter>
      </motion.div>
    </Card>
  )
}

