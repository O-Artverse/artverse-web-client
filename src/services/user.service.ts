import axiosClient from "@/configs/axios-client";

export interface UpgradeToBusinessDto {
  businessType: 'ARTIST' | 'ORGANIZATION';
  organizationName?: string;
  organizationDescription?: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  description?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export const UserService = {
  async upgradeToBusinessAccount(dto: UpgradeToBusinessDto) {
    try {
      const response = await axiosClient.post('/users/upgrade-to-business', dto);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upgrade account');
    }
  },

  async getCurrentUser() {
    try {
      const response = await axiosClient.get('/users/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  },

  async updateProfile(dto: UpdateProfileDto) {
    try {
      const response = await axiosClient.patch('/users/update-profile', dto);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  async uploadAvatar(file: File) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosClient.post('/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    }
  },

  async getBusinessDashboard() {
    try {
      const response = await axiosClient.get('/business/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get dashboard data');
    }
  }
};