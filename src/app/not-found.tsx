'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from '@phosphor-icons/react'

export default function NotFound() {
  // Simplified animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5 
      } 
    }
  }
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "tween" as const,
        duration: 0.4
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#121212] px-4 py-8">
      <motion.div 
        className="max-w-md w-full flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error Code */}
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Title */}
        <motion.h2 
          variants={itemVariants} 
          className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-300 mb-8"
        >
          Oops! It seems the art piece you're looking for has been moved to another gallery or doesn't exist.
        </motion.p>

        {/* Back button - simplified animation */}
        <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full transition-all hover:shadow-lg">
          <ArrowLeft weight="bold" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
} 