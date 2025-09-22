'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { fetchUser } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import constants from '@/settings/constants';


export function useAuth() {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const accessToken = Cookies.get(constants.ACCESS_TOKEN);
  const pathName = usePathname();
  console.log(pathName);

  useEffect(() => {
    console.log(accessToken);
    if (!accessToken) {
      console.log("NO ACCESS TOKEN");
      return;
    }

    const checkAuth = async () => {
      console.log("CHECK AUTH");
      await dispatch(fetchUser());
    };

    if (!user) {
      checkAuth();
    }
  }, [dispatch, user, accessToken, pathName]);
}
