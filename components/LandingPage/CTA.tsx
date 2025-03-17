'use client'

import { Button } from '../ui/button'
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
export default function CTA() {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className={`block ${playfairDisplay.className}`}>Ready to simplify your payroll?</span>
            <span className={`block text-primary-foreground ${playfairDisplay.className}`}>Start your free trial today.</span>
          </h2>
          <p className={`mt-4 text-lg text-primary-foreground/80 max-w-3xl ${lato.className}`}>
            Join thousands of businesses that have streamlined their payroll process with PayrollPro. No credit card required.
          </p>
        </motion.div>
        <motion.div
          className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex rounded-md shadow">
            <Button size="lg" variant="secondary" className="text-primary">
              Get started
            </Button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Button size="lg" variant="secondary" className="text-primary">
              Learn more
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

