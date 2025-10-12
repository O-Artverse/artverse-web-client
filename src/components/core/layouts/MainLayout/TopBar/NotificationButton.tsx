'use client';

import { TicketIcon } from '@phosphor-icons/react/dist/ssr';

export const NotificationButton = () => {
  return (
    <button className='p-1 hover:bg-gray-200 dark:hover:bg-[#1B1F26] rounded-full w-8 h-8 flex items-center justify-center relative'>
      <TicketIcon size={20} weight="light" className='text-gray-800 dark:text-white' />
      <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
    </button>
  );
}; 