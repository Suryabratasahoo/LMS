'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export default function DashboardCard({ title, description, icon: Icon, href }: DashboardCardProps) {


  return (
    <Link href={href} className="block">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}

      >
        <Card className="h-52 transition-shadow hover:shadow-lg">
          <CardHeader>
            <motion.div
            >
              <Icon className="h-8 w-8 text-primary mb-2" />
            </motion.div>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{description}</CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

