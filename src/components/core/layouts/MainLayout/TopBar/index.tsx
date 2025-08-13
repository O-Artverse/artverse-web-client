'use client';

import React, { useRef } from 'react';
import { SearchInput } from './SearchInput';
import { TopbarLink } from './TopbarLink';
import { NotificationButton } from './NotificationButton';
import { ShoppingButton } from './ShoppingButton';
import { UserMenu } from './UserMenu';
import { useSearchData } from './hooks/useSearchData';

interface TopbarProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Topbar({ toggleSidebar, isSidebarOpen }: TopbarProps) {
  // Initialize search data
  useSearchData();
  const topbarRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className='w-full h-[88px] relative pr-0 md:pr-3 pt-3' ref={topbarRef}>
      <div className='bg-white dark:bg-[#1E1B26] rounded-[14px] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] flex flex-row items-center justify-between h-full w-full gap-[10px] md:gap-[20px] p-[8px]'>
        {/* Search with responsive width */}
        <div className="flex-1 w-full">
          <SearchInput />
        </div>

        {/* Navigation links and buttons */}
        <div className='flex gap-[10px] md:gap-[20px] justify-center items-center'>
          {/* Hide on small screens */}
          <div className="hidden md:flex md:gap-[20px] md:items-center">
            <TopbarLink href="/artists" title="Artists" />
            <TopbarLink href="/exhibitions" title="Exhibitions" />
            <TopbarLink href="/events" title="Events" />
          </div>

          <div className="flex items-center gap-[8px] md:gap-[20px]">
            <NotificationButton />
            <ShoppingButton />
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
