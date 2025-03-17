'use client'

import { Button } from '../ui/button'
import { ArrowRight, Router } from 'lucide-react'
import { motion } from 'framer-motion'
import { Playfair_Display, Lato } from 'next/font/google';
import { useRouter } from 'next/navigation';
const playfairDisplay = Playfair_Display({
  subsets: ['latin'], // Add 'latin-ext' if needed
  weight: ['400', '700'], // Choose weights for regular and bold headings
  style: ['normal', 'italic'], // Include italic styles if required
});

const lato = Lato({
  subsets: ['latin'], // Add 'latin-ext' if needed
  weight: ['400', '700'], // Choose weights for body text
  style: ['normal'], // Only normal style needed for body text
});

export default function Hero() {
  const router=useRouter();
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-32 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl ${playfairDisplay.className} `}>
              Streamline Your <span className="text-primary">Library Operations</span>
            </h1>
            <p className={`mt-6 text-xl text-gray-500 max-w-3xl ${lato.className}`}>
            Streamline your library operations, ensure efficient cataloging, and keep your readers engaged with our comprehensive library management system.
            </p>
            <div className="mt-10">
              <Button onClick={()=>router.push('/forgot-password')} size="lg" className="inline-flex items-center group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="mt-12 lg:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              className="w-full rounded-lg shadow-2xl"
              src="/bookshelf.jpg?height=400&width=600"
              alt="Payroll dashboard preview"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

