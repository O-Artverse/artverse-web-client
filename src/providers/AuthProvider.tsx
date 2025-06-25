'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUser } from '@/store/slices/authSlice';
import webStorageClient from '@/utils/webStorageClient';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, isLoading } = useAppSelector((state) => state.authentication);

  useEffect(() => {
    if (token && !isAuthenticated && !isLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, isAuthenticated, isLoading]);

  return <>{children}</>;
}
