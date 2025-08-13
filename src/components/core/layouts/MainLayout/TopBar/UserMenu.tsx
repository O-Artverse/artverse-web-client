'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { CaretDown } from '@phosphor-icons/react/dist/ssr';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';

export const UserMenu = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      // Call the logout function from AuthService to clear cookies/storage
      await AuthService.logout();
      
      // Dispatch logout action to update Redux state
      dispatch(logout());
      
      // Close the menu
      setShowUserMenu(false);
      
      // Redirect to home page or login page
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className='' ref={avatarRef}>
      <button
        className='flex items-center gap-2 focus:outline-none'
        onClick={() => setShowUserMenu(!showUserMenu)}
      >
        <div className='w-[32px] h-[32px] rounded-sm overflow-hidden'>
          <Image
            src="/images/avatar.png"
            alt="User"
            width={40}
            height={40}
            className='w-full h-full object-cover'
          />
        </div>
        <CaretDown
          size={16}
          weight="bold"
          className={`text-black dark:text-white transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
        />
      </button>

      {showUserMenu && (
        <div className='
         top-full bg-[#FFFFFF]/90 dark:bg-[#1E1B26]/90 
        absolute right-3 w-[338px] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)]  py-2 z-50 rounded-xl flex flex-col gap-[8px] p-[12px] mt-3'>
          <div className='flex items-center gap-[8px] p-[12px] hover:bg-gray-100 dark:hover:bg-black transition-all rounded-lg'>
            <div className='w-[48px] h-[48px] rounded-none overflow-hidden'>
              <Image
                src={'/images/avatar.png'}
                alt="artist"
                width={48}
                height={48}
                className='object-cover w-full h-full'
              />
            </div>
            <div className='flex flex-col gap-[2px]'>
              <h3 className='text-[16px] text-black font-bold dark:text-white'>James Anderson</h3>
              <p className='text-gray-500 text-[12px] dark:text-gray-400'>Personal</p>
              <p className='text-gray-500 text-[12px] dark:text-gray-400'>james@gmail.com</p>
            </div>
          </div>
          <Link href="/profile" className='rounded-md block px-3 py-[8px] font-bold text-sm text-gray-700 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-black transition-all'>
          Switch to an artist account
          </Link>
          <p className='text-[12px] px-3 py-2 text-black/60 dark:text-white/60'>Your account</p>
          <Link href="/profile" className='rounded-md block px-3 py-[8px] font-bold text-sm text-gray-700 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-black transition-all'>
          Add more accounts
          </Link> 
          <button 
            onClick={handleSignOut}
            className='rounded-md text-left block font-bold px-3 py-[8px] text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-black transition-all'
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}; 