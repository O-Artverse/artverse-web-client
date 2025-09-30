import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chat.service';
import { FavoriteArtwork } from '@/types/chat';
import { queryKeys } from '@/constants/query-keys';

export function useFavoriteArtworks() {
  return useQuery({
    queryKey: [queryKeys.FAVORITE_ARTWORKS],
    queryFn: ChatService.getFavoriteArtworks,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// TODO: Implement these methods in ChatService
// export function useAddToFavorites() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: (artworkId: string) => ChatService.addToFavorites(artworkId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [queryKeys.FAVORITE_ARTWORKS] });
//     },
//   });
// }

// export function useRemoveFromFavorites() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: (artworkId: string) => ChatService.removeFromFavorites(artworkId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [queryKeys.FAVORITE_ARTWORKS] });
//     },
//   });
// } 