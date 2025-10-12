import { API_BASE_URL } from '@/constants/env';

/**
 * Get full image URL by appending API base URL to relative path
 * @param imagePath - Relative image path from backend (e.g., "/uploads/avatars/xxx.png")
 * @returns Full URL (e.g., "http://localhost:8080/uploads/avatars/xxx.png")
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;

  // If imagePath is already a full URL (starts with http or data:), return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
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

/**
 * Get artwork image URL
 * @param imagePath - Image path from artwork object
 * @returns Full image URL or null
 */
export const getArtworkImageUrl = (imagePath: string | null | undefined): string | null => {
  return getImageUrl(imagePath);
};

/**
 * Get event banner URL
 * @param bannerPath - Banner path from event object
 * @returns Full banner URL or null
 */
export const getEventBannerUrl = (bannerPath: string | null | undefined): string | null => {
  return getImageUrl(bannerPath);
};

/**
 * Get audio file URL
 * @param audioPath - Audio path from backend (e.g., "/uploads/audio/xxx.mp3")
 * @returns Full URL or null
 */
export const getAudioUrl = (audioPath: string | null | undefined): string | null => {
  return getImageUrl(audioPath);
};

/**
 * Get VTT subtitle file URL
 * @param vttPath - VTT path from backend (e.g., "/uploads/vtt/xxx.vtt")
 * @returns Full URL or null
 */
export const getVttUrl = (vttPath: string | null | undefined): string | null => {
  return getImageUrl(vttPath);
};