'use client';

import { ShoppingBagOpenIcon } from '@phosphor-icons/react';

export const ShoppingButton = () => {
  return (
    <button className='p-1 hover:bg-gray-200 dark:hover:bg-[#1B1F26] rounded-full w-8 h-8 flex items-center justify-center relative'>
      <ShoppingBagOpenIcon size={20} weight="light" className='dark:text-white' />
      <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
    </button>
  );
}; 