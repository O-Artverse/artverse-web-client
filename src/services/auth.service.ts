import axios from 'axios';
import webStorageClient from '@/utils/webStorageClient';
import constants from '@/settings/constants';
import axiosClient from '@/configs/axios-client';

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await axiosClient.post(`/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      webStorageClient.setToken(token);
      return { token, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async logout() {
    webStorageClient.remove(constants.ACCESS_TOKEN);
    webStorageClient.remove(constants.REFRESH_TOKEN);
  },
};

export const checkAuth = async () => {
  try {
    const token = webStorageClient.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axiosClient.get(`/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    webStorageClient.remove(constants.ACCESS_TOKEN);
    webStorageClient.remove(constants.REFRESH_TOKEN);
    throw new Error(error.response?.data?.message || 'Authentication failed');
  }
};

export const refreshTokens = async (refreshToken: string) => {
  {
    try {
      const response = await axiosClient.post(`/auth/refresh-tokens`, {
        refreshToken,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  }
};
