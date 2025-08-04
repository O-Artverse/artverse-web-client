import webStorageClient from '@/utils/webStorageClient';
import constants from '@/settings/constants';
import axiosClient from '@/configs/axios-client';
import type { LoginPostDto, RegisterPostDto } from '@/types/user';
import type { RegisterResponsePostDto } from '@/models/auth/register.response.dto';
import { API_BASE_URL } from '@/constants/env';
import { SignUpPostDto } from '@/models/auth/SignUpSchema';

export const AuthService = {
  async register(dto: SignUpPostDto) {
    try {
      const response: RegisterResponsePostDto = await axiosClient.post(`/auth/register`,
        dto
      );
      return { response };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  async login(dto: LoginPostDto) {
    try {
      const response = await axiosClient.post(`/auth/login`, dto);
      const { accessToken, refreshToken, user } = response.data;
      webStorageClient.setToken(accessToken);
      if (refreshToken) webStorageClient.setRefreshToken(refreshToken);
      return { token: accessToken, refreshToken, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async logout() {
    webStorageClient.remove(constants.ACCESS_TOKEN);
    webStorageClient.remove(constants.REFRESH_TOKEN);
  },
  getGoogleAuthUrl() {
    // Make sure we have a full URL with protocol
    if (!API_BASE_URL) {
      return 'http://localhost:8080/auth/google';
    }

    // If API_BASE_URL already includes the protocol, use it directly
    if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
      return `${API_BASE_URL}/auth/google`;
    }

    // Otherwise, add the http protocol
    return `http://${API_BASE_URL}/auth/google`;
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
