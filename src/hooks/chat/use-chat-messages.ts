import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chat.service';
import { ChatMessage } from '@/types/chat';
import { queryKeys } from '@/constants/query-keys';

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
      artwork 
    }: { 
      roomId: string; 
      content: string; 
      type?: 'text' | 'image' | 'artwork'; 
      artwork?: any; 
    }) => ChatService.sendMessage(roomId, content, type, artwork),
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