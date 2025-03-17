'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-2xl text-primary">
              BookShelf
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link
              href="#features"
              className="relative text-base font-medium text-gray-500 transition-all overflow-hidden rounded-lg group p-2 w-40 flex items-center justify-center"
            >
              <span className="absolute inset-0 bg-black translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
              <span className="relative text-gray-500 group-hover:text-white transition-colors duration-300">
                Features
              </span>
            </Link>

            <Link
              href="#features"
              className="relative text-base font-medium text-gray-500 transition-all overflow-hidden rounded-lg group p-2 w-40 flex items-center justify-center"
            >
              <span className="absolute inset-0 bg-black translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
              <span className="relative text-gray-500 group-hover:text-white transition-colors duration-300">
                Testimonials
              </span>
            </Link>

            <Link
              href="#features"
              className="relative text-base font-medium text-gray-500 transition-all overflow-hidden rounded-lg group p-2 w-40 flex items-center justify-center"
            >
              <span className="absolute inset-0 bg-black translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
              <span className="relative text-gray-500 group-hover:text-white transition-colors duration-300">
                Borrow
              </span>
            </Link>


          </nav>
          <div className="hidden md:flex items-center">
            <Button onClick={()=>router.push('/signin')} variant="ghost" className="mr-4">Log in</Button>
            <Button onClick={()=>router.push('/signup')}>Sign up</Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">Features</Link>
            <Link href="#testimonials" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">Testimonials</Link>
            <Link href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">Pricing</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              <Button onClick={()=>router.push('/signin')} variant="ghost" className="w-full justify-start">Log in</Button>
              <Button onClick={()=>router.push('/signup')} className="w-full">Sign up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

