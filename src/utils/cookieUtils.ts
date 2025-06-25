'use server';
import { cookies as serverCookies } from 'next/headers';
import Cookies from 'js-cookie';

export const getCookie = async (key: string) => {
  if (typeof window === 'undefined') {
    const cookieStore = await serverCookies();

    return cookieStore.get(key)?.value || null;
  } else {
    return Cookies.get(key) || null;
  }
};
