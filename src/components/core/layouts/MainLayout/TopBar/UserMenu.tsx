'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { CaretDown } from '@phosphor-icons/react/dist/ssr';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { SwitchToArtistModal } from '@/components/modals/SwitchToArtistModal';
import { getUserAvatarUrl } from '@/utils/imageUtils';

export const UserMenu = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleUpgradeClick = () => {
    setShowUserMenu(false);
    setShowUpgradeModal(true);
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.name || user?.username || 'User';
  };

  const getRoleDisplay = () => {
    if (user?.role === 'BUSINESS') {
      return user?.businessType === 'ARTIST' ? 'Artist' : 'Organization';
    }
    return 'Personal';
  };

  const getUserAvatar = () => {
    // Check if user has an avatar
    if (user?.avatar) {
      return getUserAvatarUrl(user.avatar) || '/images/blank-avatar.png';
    }
    // Return default/blank avatar
    return '/images/blank-avatar.png';
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className='' ref={avatarRef}>
      <button
        className='flex items-center gap-2 focus:outline-none'
        onClick={() => setShowUserMenu(!showUserMenu)}
      >
        <div className='w-[32px] h-[32px] rounded-lg overflow-hidden relative bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
          {mounted && user?.avatar ? (
            <Image
              src={getUserAvatar()}
              alt={getDisplayName()}
              width={40}
              height={40}
              className='w-full h-full object-cover'
            />
          ) : mounted ? (
            <span className='text-sm font-semibold text-gray-600 dark:text-gray-300'>
              {getInitials()}
            </span>
          ) : null}
        </div>
        <CaretDown
          size={16}
          weight="bold"
          className={`text-gray-800 dark:text-white transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
        />
      </button>

      {showUserMenu && (
        <div className='
         top-full bg-[#FFFFFF]/90 dark:bg-[#1E1B26]/90 
        absolute right-3 w-[338px] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)]  py-2 z-50 rounded-xl flex flex-col gap-[8px] p-[12px] mt-3'>
          <div className='flex items-center gap-[8px] p-[12px] hover:bg-gray-100 dark:hover:bg-black transition-all rounded-lg'
          onClick={() => { setShowUserMenu(false); router.push('/profile'); }}
          >
            <div className='w-[48px] h-[48px] rounded-lg overflow-hidden relative bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
              {mounted && user?.avatar ? (
                <Image
                  src={getUserAvatar()}
                  alt={getDisplayName()}
                  width={48}
                  height={48}
                  className='object-cover w-full h-full'
                />
              ) : mounted ? (
                <span className='text-lg font-semibold text-gray-600 dark:text-gray-300'>
                  {getInitials()}
                </span>
              ) : null}
            </div>
            <div className='flex flex-col gap-[2px]'>
              <h3 className='text-[16px] text-black font-bold dark:text-white'>{getDisplayName()}</h3>
              <p className='text-gray-500 text-[12px] dark:text-gray-400'>{getRoleDisplay()}</p>
              <p className='text-gray-500 text-[12px] dark:text-gray-400'>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          {user?.role === 'USER' && (
            <button
              onClick={handleUpgradeClick}
              className='rounded-md block px-3 py-[8px] font-bold text-sm text-gray-700 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-black transition-all w-full text-left'
            >
              Switch to an artist account
            </button>
          )}
          {user?.role === 'BUSINESS' && (
            <Link href="/business" className='rounded-md block px-3 py-[8px] font-bold text-sm text-gray-700 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-black transition-all'>
              Business Dashboard
            </Link>
          )}
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

      {/* Upgrade Modal */}
      <SwitchToArtistModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}; 