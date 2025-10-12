'use client';

import Link from 'next/link';
import { ShoppingBagOpenIcon } from '@phosphor-icons/react';
import { useCart } from '@/hooks/queries/cart.query';

export const ShoppingButton = () => {
  const { data: cart } = useCart();
  const itemCount = cart?.totalItems || 0;

  return (
    <Link href="/cart" className='p-1 hover:bg-gray-200 dark:hover:bg-[#1B1F26] rounded-full w-8 h-8 flex items-center justify-center relative'>
      <ShoppingBagOpenIcon size={20} weight="light" className='text-gray-800 dark:text-white' />
      {itemCount > 0 && (
        <span className='absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center'>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}; 