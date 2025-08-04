import Cookies from 'js-cookie'; // or use cookies-next

export const getClientCookie = (key: string) => {
  if (typeof window !== 'undefined') {
    return Cookies.get(key) || null;
  }

  return null;
};
