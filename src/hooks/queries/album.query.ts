import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import albumService, { Album } from '@/services/album.service';

// Query Keys
export const albumKeys = {
  all: ['albums'] as const,
  lists: () => [...albumKeys.all, 'list'] as const,
  myAlbums: () => [...albumKeys.all, 'my-albums'] as const,
  userAlbums: (userId: string) => [...albumKeys.all, 'user', userId] as const,
  details: () => [...albumKeys.all, 'detail'] as const,
  detail: (id: string) => [...albumKeys.details(), id] as const,
};

// Get current user's albums
export const useMyAlbums = (options?: UseQueryOptions<Album[]>) => {
  return useQuery({
    queryKey: albumKeys.myAlbums(),
    queryFn: () => albumService.getMyAlbums(),
    ...options,
  });
};

// Get user's public albums
export const useUserAlbums = (
  userId: string,
  options?: UseQueryOptions<Album[]>,
) => {
  return useQuery({
    queryKey: albumKeys.userAlbums(userId),
    queryFn: () => albumService.getUserAlbums(userId),
    enabled: !!userId,
    ...options,
  });
};

// Get album by ID
export const useAlbum = (id: string, options?: UseQueryOptions<Album>) => {
  return useQuery({
    queryKey: albumKeys.detail(id),
    queryFn: () => albumService.getAlbumById(id),
    enabled: !!id,
    ...options,
  });
};