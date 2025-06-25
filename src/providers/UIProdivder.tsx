'use client';
import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ToastProvider } from '@heroui/react';

interface ComponentProps {
  children: React.ReactNode;
}

export function UIProvider({ children }: ComponentProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider placement="bottom-center" />
      {children}
    </HeroUIProvider>
  );
}
