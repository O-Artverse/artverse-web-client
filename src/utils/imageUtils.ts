import { API_BASE_URL } from '@/constants/env';

/**
 * Get full image URL by appending API base URL to relative path
 * @param imagePath - Relative image path from backend (e.g., "/uploads/avatars/xxx.png")
 * @returns Full URL (e.g., "http://localhost:8080/uploads/avatars/xxx.png")
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;

  // If imagePath is already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Ensure imagePath starts with /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Get user avatar URL with fallback
 * @param avatarPath - Avatar path from user object
 * @returns Full avatar URL or null
 */
export const getUserAvatarUrl = (avatarPath: string | null | undefined): string | null => {
  return getImageUrl(avatarPath);
};