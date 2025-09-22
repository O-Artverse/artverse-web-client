import axiosClient from "@/configs/axios-client";

export interface UpgradeToBusinessDto {
  businessType: 'ARTIST' | 'ORGANIZATION';
  organizationName?: string;
  organizationDescription?: string;
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

  async getBusinessDashboard() {
    try {
      const response = await axiosClient.get('/business/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get dashboard data');
    }
  }
};