import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, UpgradeToBusinessDto, UpdateProfileDto } from '@/services/user.service';

export const useUpgradeToBusinessAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpgradeToBusinessDto) => UserService.upgradeToBusinessAccount(data),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => UserService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => UserService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useGetCurrentUser = () => {
  return useMutation({
    mutationFn: () => UserService.getCurrentUser(),
  });
};

export const useGetBusinessDashboard = () => {
  return useMutation({
    mutationFn: () => UserService.getBusinessDashboard(),
  });
};