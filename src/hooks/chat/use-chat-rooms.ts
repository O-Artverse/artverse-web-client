import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chat.service';
import { ChatRoom, ChatUser } from '@/types/chat';
import { queryKeys } from '@/constants/query-keys';

export function useChatRooms() {
  return useQuery({
    queryKey: [queryKeys.CHAT_ROOMS],
    queryFn: ChatService.getRooms,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; type: 'DIRECT' | 'GROUP' | 'EXHIBITION'; participantIds: string[] }) =>
      ChatService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.CHAT_ROOMS] });
    },
  });
}

export function useChatMessages(roomId: string) {
  return useQuery({
    queryKey: [queryKeys.CHAT_MESSAGES, roomId],
    queryFn: () => ChatService.getMessages(roomId),
    enabled: !!roomId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      content,
      type,
      artworkId
    }: {
      roomId: string;
      content: string;
      type?: 'text' | 'image' | 'artwork';
      artworkId?: string;
    }) => ChatService.sendMessage(roomId, {
      content,
      type: (type?.toUpperCase() || 'TEXT') as 'TEXT' | 'IMAGE' | 'ARTWORK' | 'SYSTEM',
      artworkId
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.CHAT_MESSAGES, variables.roomId]
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.CHAT_ROOMS]
      });
    },
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['search-users', query],
    queryFn: () => ChatService.searchUsers(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

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
