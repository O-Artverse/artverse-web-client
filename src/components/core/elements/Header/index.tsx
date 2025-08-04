"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LogoIcon from "@/assets/images/logoIcon.png"
import { Button } from '@heroui/react'
import { useRouter, usePathname } from 'next/navigation'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  
  const isAuthPage = pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up'
  const isSignInPage = pathname.includes('/sign-in')
  const isSignUpPage = pathname.includes('/sign-up')

  return (
    <header className={`${isAuthPage ? 'absolute' : 'relative'} top-0 left-0 right-0 z-30 px-4 py-3 bg-white/70 backdrop-blur-md border-b border-white/30 shadow-md`}>
      <div className='container mx-auto flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link href="/">
            <div className='flex items-center gap-2'>
              <Image src={LogoIcon} alt="Artverse" width={24} height={24} />
              <span className='font-semibold text-lg text-primary'>Artverse</span>
            </div>
          </Link>
        </div>
        
        <nav className='flex items-center gap-6'>
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
              className='bg-primary text-white rounded-full px-4 py-1 text-sm font-medium'
              onPress={() => router.push('/sign-in')}
            >
              Sign In
            </Button>
          )}
          
          {!isSignUpPage && (
            <Button 
              className={`${isAuthPage ? 'bg-transparent text-gray-800' : 'border border-gray-300 text-gray-800'} rounded-full px-4 py-1 text-sm font-medium`}
              onPress={() => router.push('/sign-up')}
            >
              Sign Up
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header