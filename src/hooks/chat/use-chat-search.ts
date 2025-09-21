import { useQuery } from '@tanstack/react-query';
import { ChatService } from '@/services/chat.service';
import { ChatUser } from '@/types/chat';

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['search-users', query],
    queryFn: () => ChatService.searchUsers(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
} 