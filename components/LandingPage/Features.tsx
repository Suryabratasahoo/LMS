'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users,BookOpen,Search,RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Playfair_Display, Lato } from 'next/font/google';

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

const features = [
  {
    name: 'Automated Cataloging',
    description: 'Effortlessly organize and categorize books with our intelligent system.',
    icon: BookOpen,
  },
  {
    name: 'Quick Book Search',
    description: 'Find books instantly with our powerful search and filtering tools.',
    icon: Search,
  },
  {
    name: 'Efficient Borrowing & Returns',
    description: 'Streamline checkouts and returns with automated tracking.',
    icon: RefreshCcw,
  },
  {
    name: 'Member Self-Service',
    description: 'Allow members to check availability, reserve books, and manage their accounts online.',
    icon: Users,
  },
];


const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 0.05 * (index + 1),
    },
  }),
}

export default function Features() {
  return (
    <div className="bg-white py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className={`mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl ${playfairDisplay.className}`}>
          Everything You Need in a Library Management System
          </p>
          <p className={`mt-4 max-w-2xl text-xl text-gray-500 mx-auto ${lato.className}`}>
          Designed to make your library management seamless, efficient, and organized.
          </p>
        </motion.div>
        <motion.div
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              variants={cardVariants}
              custom={index}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className={`text-xl ${playfairDisplay.className}`}>{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`text-base ${lato.className}`}>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

