'use client'

import { Card, CardContent, CardFooter } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
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

const testimonials = [
  {
    name: 'Sarah Thompson',
    role: 'HR Manager, TechCorp',
    content: "BookShelf has transformed our library management. It's intuitive, efficient, and saves us countless hours in organizing and tracking books.",
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Michael Chen',
    role: 'CFO, StartUp Inc.',
    content: 'The automation features alone make LibraFlow worth every penny. We never have to worry about tracking books or managing due dates manually.',
    avatar: '/placeholder.svg?height=40&width=40',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

export default function Testimonials() {
  return (
    <div className="bg-gray-50 py-24" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className={`text-3xl font-extrabold text-gray-900 sm:text-4xl ${playfairDisplay.className}`}>
            What our customers are saying
          </h2>
          <p className={`mt-4 text-xl text-gray-500 ${lato.className}`}>
            Don't just take our word for it - hear from some of our satisfied customers!
          </p>
        </motion.div>
        <motion.div
          className="mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <p className="text-lg text-gray-600 italic">"{testimonial.content}"</p>
                  </CardContent>
                  <CardFooter className="flex items-center mt-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-base text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

