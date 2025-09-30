import { useQuery, UseQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import artworkService, {
  Artwork,
  ArtworkCategory,
} from '@/services/artwork.service';

// Query Keys
export const artworkKeys = {
  all: ['artworks'] as const,
  lists: () => [...artworkKeys.all, 'list'] as const,
  list: (filters: any) => [...artworkKeys.lists(), filters] as const,
  details: () => [...artworkKeys.all, 'detail'] as const,
  detail: (id: string) => [...artworkKeys.details(), id] as const,
  saved: () => [...artworkKeys.all, 'saved'] as const,
  categories: () => [...artworkKeys.all, 'categories'] as const,
};

// Get all artworks with filters
export const useArtworks = (
  params?: {
    search?: string;
    categoryId?: string;
    status?: string;
    creatorId?: string;
    organizationId?: string;
    limit?: number;
    offset?: number;
  },
  options?: UseQueryOptions<{
    data: Artwork[];
    total: number;
    limit: number;
    offset: number;
  }>,
) => {
  return useQuery({
    queryKey: artworkKeys.list(params),
    queryFn: () => artworkService.getArtworks(params),
    ...options,
  });
};

// Get single artwork by ID
export const useArtwork = (
  id: string,
  options?: UseQueryOptions<Artwork>,
) => {
  return useQuery({
    queryKey: artworkKeys.detail(id),
    queryFn: () => artworkService.getArtworkById(id),
    enabled: !!id,
    ...options,
  });
};

// Get user's saved artworks
export const useSavedArtworks = (
  options?: UseQueryOptions<Artwork[]>,
) => {
  return useQuery({
    queryKey: artworkKeys.saved(),
    queryFn: () => artworkService.getSavedArtworks(),
    ...options,
  });
};

// Get artwork categories
export const useArtworkCategories = (
  options?: UseQueryOptions<ArtworkCategory[]>,
) => {
  return useQuery({
    queryKey: artworkKeys.categories(),
    queryFn: () => artworkService.getCategories(),
    ...options,
  });
};

// Infinite query for artworks
export const useInfiniteArtworks = (
  params?: {
    search?: string;
    categoryId?: string;
    status?: string;
    creatorId?: string;
    organizationId?: string;
    limit?: number;
  },
) => {
  const limit = params?.limit || 20;

  return useInfiniteQuery({
    queryKey: artworkKeys.list(params),
    queryFn: async ({ pageParam = 0 }) => {
      return artworkService.getArtworks({
        ...params,
        limit,
        offset: pageParam,
      });
    },
    getNextPageParam: (lastPage, pages) => {
      const totalFetched = pages.reduce((sum, page) => sum + page.data.length, 0);
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
    initialPageParam: 0,
  });
};