import axios from 'axios';
import Cookies from 'js-cookie';

import { API_BASE_URL } from '@/constants/env';
import { refreshTokens } from '@/services/auth.service';
import { getCookie } from '@/utils/cookieUtils';

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    if (!currentPath.includes('/login')) {
      window.location.href = `/login`;
    }
  }
};

const getAccessToken = async () => {
  let accessToken = (await getCookie('accessToken')) || null;
  let refreshToken = (await getCookie('refreshToken')) || null;

  if (typeof document !== 'undefined' && !accessToken && !refreshToken) {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('accessToken='));
    const refreshCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));

    if (tokenCookie) {
      accessToken = tokenCookie.split('=')[1];
    }
    if (refreshCookie) {
      refreshToken = refreshCookie.split('=')[1];
    }
  }

  return { accessToken, refreshToken };
};

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRrefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

axiosClient.interceptors.request.use(
  async (config) => {
    const { accessToken } = await getAccessToken();

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken } = await getAccessToken();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!refreshToken || originalRequest.url === '/auth/refresh-tokens') {
        redirectToLogin();

        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshTokens(refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse;

        onRrefreshed(accessToken);

        isRefreshing = false;

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        Cookies.set('accessToken', accessToken, {
          secure: true,
          sameSite: 'strict',
          path: '/',
        });

        Cookies.set('refreshToken', newRefreshToken, {
          secure: true,
          sameSite: 'strict',
          path: '/',
        });

        return axiosClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        redirectToLogin();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
