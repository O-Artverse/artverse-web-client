'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUser } from '@/store/slices/authSlice';
import webStorageClient from '@/utils/webStorageClient';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = webStorageClient.getToken();

    // If we have a token but no user data or not authenticated, fetch user
    if (accessToken && (!user || !isAuthenticated) && !isLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, isAuthenticated, isLoading]);

  return <>{children}</>;
}
