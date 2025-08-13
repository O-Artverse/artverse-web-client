"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@heroui/react'
import { useRouter, usePathname } from 'next/navigation'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isAuthPage = pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up'
  const isSignInPage = pathname.includes('/sign-in')
  const isSignUpPage = pathname.includes('/sign-up')

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className={`${isAuthPage ? 'absolute' : 'relative'} top-0 left-0 right-0 z-30 px-4 py-3 bg-white/70 backdrop-blur-md border-b border-white/30 shadow-md`}>
      <div className='container mx-auto flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link href="/">
            <div className='flex items-center gap-2'>
              <Image src={'/images/logoIcon.png'} alt="Artverse" width={24} height={24} />
              <span className='font-semibold text-lg text-primary'>Artverse</span>
            </div>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center p-2 rounded-md transition-all duration-300 ease-in-out"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-5 flex flex-col justify-between items-center">
            <span className={`bg-gray-800 h-0.5 w-full rounded-full transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`bg-gray-800 h-0.5 w-full rounded-full transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`bg-gray-800 h-0.5 w-full rounded-full transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>

        {/* Desktop navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          <Link href="/about" className={`text-sm font-medium ${isAuthPage ? 'text-gray-800 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>
            About
          </Link>
          <Link href="/create" className={`text-sm font-medium ${isAuthPage ? 'text-gray-800 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>
            Create
          </Link>
          <Link href="/news" className={`text-sm font-medium ${isAuthPage ? 'text-gray-800 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>
            News
          </Link>
          <Link href="/artist" className={`text-sm font-medium ${isAuthPage ? 'text-gray-800 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>
            Artist
          </Link>
          
          {!isSignInPage && (
            <Button 
              className='bg-primary text-white rounded-xl px-4 py-1 text-sm font-medium'
              onPress={() => router.push('/sign-in')}
            >
              Sign In
            </Button>
          )}
          
          {!isSignUpPage && (
            <Button 
              className={`${isAuthPage ? 'bg-white/20 text-gray-800' : 'border border-gray-300 text-gray-800'} rounded-xl px-4 py-1 text-sm font-medium`}
              onPress={() => router.push('/sign-up')}
            >
              Sign Up
            </Button>
          )}
        </nav>
      </div>

      {/* Mobile menu dropdown with animation */}
      <div 
        className={`md:hidden fixed inset-x-0 top-[60px] bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out rounded-b-xl ${
          mobileMenuOpen 
            ? 'max-h-[500px] opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-4'
        }`}
        style={{ overflowY: mobileMenuOpen ? 'auto' : 'hidden' }}
      >
        <div className="p-5 border-t border-white/30">
          <nav className='flex flex-col gap-5'>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-all duration-300 ease-in-out transform hover:translate-x-1 ${isAuthPage ? 'text-gray-800 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/create" 
              className={`text-sm font-medium transition-all duration-300 ease-in-out transform hover:translate-x-1 ${isAuthPage ? 'text-gray-800 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Create
            </Link>
            <Link 
              href="/news" 
              className={`text-sm font-medium transition-all duration-300 ease-in-out transform hover:translate-x-1 ${isAuthPage ? 'text-gray-800 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              News
            </Link>
            <Link 
              href="/artist" 
              className={`text-sm font-medium transition-all duration-300 ease-in-out transform hover:translate-x-1 ${isAuthPage ? 'text-gray-800 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Artist
            </Link>
            
            <div className="flex flex-col gap-3 mt-2 animate-fade-in-up">
              {!isSignInPage && (
                <Button 
                  className='bg-primary text-white rounded-xl px-4 py-2 text-sm font-medium w-full transition-all duration-300 ease-in-out hover:bg-primary/90 hover:shadow-md'
                  onPress={() => {
                    setMobileMenuOpen(false)
                    router.push('/sign-in')
                  }}
                >
                  Sign In
                </Button>
              )}
              
              {!isSignUpPage && (
                <Button 
                  className={`${isAuthPage ? 'bg-white/20 text-gray-800' : 'border border-gray-300 text-gray-800'} rounded-xl px-4 py-2 text-sm font-medium w-full transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-sm`}
                  onPress={() => {
                    setMobileMenuOpen(false)
                    router.push('/sign-up')
                  }}
                >
                  Sign Up
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Add custom keyframes animation
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
`;

// Add the style tag to the document
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

export default Header