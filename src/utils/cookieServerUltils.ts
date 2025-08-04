'use server';
import { cookies as serverCookies } from 'next/headers';

export const getServerCookie = async (key: string) => {
  const cookieStore = await serverCookies();

  return cookieStore.get(key)?.value || null;
};
