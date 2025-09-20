import { useEffect } from 'react';
import socketClient from '@/lib/socket-client';
import { ChatMessage, ChatRoom } from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { useState } from 'react';

export function useChatSocket(roomId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = socketClient.getSocket();
    
    if (!socket) return;

    // Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      // Update messages for the specific room
      queryClient.setQueryData(
        [queryKeys.CHAT_MESSAGES, message.roomId],
        (oldMessages: ChatMessage[] = []) => [...oldMessages, message]
      );

      // Update rooms list with last message
      queryClient.setQueryData(
        [queryKeys.CHAT_ROOMS],
        (oldRooms: ChatRoom[] = []) =>
          oldRooms.map(room =>
            room.id === message.roomId
              ? { ...room, lastMessage: message, unreadCount: room.unreadCount + 1 }
              : room
          )
      );
    };

    // Listen for room updates
    const handleRoomUpdate = (room: ChatRoom) => {
      queryClient.setQueryData(
        [queryKeys.CHAT_ROOMS],
        (oldRooms: ChatRoom[] = []) =>
          oldRooms.map(r => r.id === room.id ? room : r)
      );
    };

    // Listen for typing indicators
    const handleTyping = (data: { roomId: string; userId: string; isTyping: boolean }) => {
      // Handle typing indicators
      console.log('User typing:', data);
    };

    // Join room if roomId is provided
    if (roomId) {
      socket.emit('join_room', { roomId });
    }

    // Register event listeners
    socket.on('new_message', handleNewMessage);
    socket.on('room_update', handleRoomUpdate);
    socket.on('typing', handleTyping);

    return () => {
      // Leave room if roomId is provided
      if (roomId) {
        socket.emit('leave_room', { roomId });
      }

      // Remove event listeners
      socket.off('new_message', handleNewMessage);
      socket.off('room_update', handleRoomUpdate);
      socket.off('typing', handleTyping);
    };
  }, [roomId, queryClient]);
}

export function useSendMessage() {
  const sendMessage = (message: Partial<ChatMessage>) => {
    const socket = socketClient.getSocket();
    if (socket) {
      socket.emit('send_message', message);
    }
  };

  return { sendMessage };
}

export function useTypingIndicator(roomId: string) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket = socketClient.getSocket();
    if (!socket) return;

    const handleTyping = (data: { roomId: string; userId: string; isTyping: boolean }) => {
      if (data.roomId === roomId) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return prev.includes(data.userId) ? prev : [...prev, data.userId];
          } else {
            return prev.filter(id => id !== data.userId);
          }
        });
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [roomId]);

  const startTyping = () => {
    const socket = socketClient.getSocket();
    if (socket && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', { roomId, isTyping: true });
    }
  };

  const stopTyping = () => {
    const socket = socketClient.getSocket();
    if (socket && isTyping) {
      setIsTyping(false);
      socket.emit('typing', { roomId, isTyping: false });
    }
  };

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
} 