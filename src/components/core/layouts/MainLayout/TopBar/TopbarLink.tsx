'use client';

import Link from 'next/link';

interface TopbarLinkProps {
  href: string;
  title: string;
}

export const TopbarLink = ({ href, title }: TopbarLinkProps) => {
  return (
    <Link
      href={href}
      className='text-[14px] flex justify-center items-center font-normal hover:text-purple-600 dark:text-white dark:hover:text-purple-400'
    >
      {title}
    </Link>
  );
}; 