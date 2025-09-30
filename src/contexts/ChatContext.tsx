'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ChatState, ChatRoom, ChatMessage, ChatUser, FavoriteArtwork } from '@/types/chat';
import socketClient from '@/lib/socket-client';
import { ChatService } from '@/services/chat.service';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import constants from '@/settings/constants';

interface ChatContextType extends ChatState {
  // Actions
  setActiveRoom: (room: ChatRoom | null) => void;
  sendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'ARTWORK', replyToId?: string) => void;
  sendArtwork: (artwork: FavoriteArtwork) => void;
  addReaction: (messageId: string, emoji: string) => void;
  createRoom: (participants: ChatUser[]) => void;
  searchUsers: (query: string) => Promise<ChatUser[]>;
  getFavoriteArtworks: () => Promise<FavoriteArtwork[]>;
  selectArtwork: (artworkId: string) => void;
  clearSelectedArtworks: () => void;
  loadRooms: () => Promise<void>;
  loadMessages: (roomId: string) => Promise<void>;
  getRecommendedUsers: () => Promise<ChatUser[]>;
  // UI State
  showFavoriteArtworks: boolean;
  setShowFavoriteArtworks: (show: boolean) => void;
  selectedArtworks: string[];
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ROOMS'; payload: ChatRoom[] }
  | { type: 'SET_ACTIVE_ROOM'; payload: ChatRoom | null }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_MESSAGE_TO_ROOM'; payload: { roomId: string; message: ChatMessage } }
  | { type: 'UPDATE_ROOM_LAST_MESSAGE'; payload: { roomId: string; message: ChatMessage } }
  | { type: 'UPDATE_MESSAGE_REACTION'; payload: { messageId: string; userId: string; emoji: string; action: 'added' | 'removed' } }
  | { type: 'SET_SHOW_FAVORITE_ARTWORKS'; payload: boolean }
  | { type: 'SET_SELECTED_ARTWORKS'; payload: string[] }
  | { type: 'CLEAR_SELECTED_ARTWORKS' };

const initialState: ChatState = {
  rooms: [],
  activeRoom: null,
  messages: [],
  isConnected: false,
  isLoading: false,
  error: null,
  showFavoriteArtworks: false,
  selectedArtworks: [],
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'SET_ACTIVE_ROOM':
      return { ...state, activeRoom: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'ADD_MESSAGE_TO_ROOM':
      // Only add message if we're currently viewing that room
      if (state.activeRoom?.id === action.payload.roomId) {
        return {
          ...state,
          messages: [...state.messages, action.payload.message],
        };
      }
      return state;
    case 'UPDATE_ROOM_LAST_MESSAGE':
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.id === action.payload.roomId
            ? { ...room, lastMessage: action.payload.message, updatedAt: action.payload.message.timestamp }
            : room
        ),
      };
    case 'UPDATE_MESSAGE_REACTION':
      return {
        ...state,
        messages: state.messages.map((msg) => {
          if (msg.id !== action.payload.messageId) return msg;

          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === action.payload.emoji);

          if (action.payload.action === 'added') {
            if (existingReaction) {
              // Add user to existing reaction
              return {
                ...msg,
                reactions: reactions.map(r =>
                  r.emoji === action.payload.emoji
                    ? { ...r, count: r.count + 1, users: [...r.users, action.payload.userId] }
                    : r
                ),
              };
            } else {
              // Create new reaction
              return {
                ...msg,
                reactions: [...reactions, { emoji: action.payload.emoji, count: 1, users: [action.payload.userId] }],
              };
            }
          } else {
            // Remove user from reaction
            return {
              ...msg,
              reactions: reactions
                .map(r =>
                  r.emoji === action.payload.emoji
                    ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== action.payload.userId) }
                    : r
                )
                .filter(r => r.count > 0),
            };
          }
        }),
      };
    case 'SET_SHOW_FAVORITE_ARTWORKS':
      return { ...state, showFavoriteArtworks: action.payload };
    case 'SET_SELECTED_ARTWORKS':
      return { ...state, selectedArtworks: action.payload };
    case 'CLEAR_SELECTED_ARTWORKS':
      return { ...state, selectedArtworks: [] };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    showFavoriteArtworks: false,
    selectedArtworks: [],
  });

  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?.id || '';

  // Load rooms on mount
  useEffect(() => {
    if (user) {
      console.log('📦 Loading rooms for user:', user.id);
      loadRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Socket connection for chat
  useEffect(() => {
    console.log('🔧 Socket useEffect triggered');
    console.log('User:', user ? user.id : 'No user');

    if (!user) {
      console.log('⚠️ No user, skipping socket connection');
      return;
    }

    const accessToken = Cookies.get(constants.ACCESS_TOKEN);

    console.log('Access token from cookie:', accessToken ? 'Found' : 'Not found');
    if (!accessToken) {
      console.log('All cookies:', document.cookie);
    }

    if (!accessToken) {
      console.log('⚠️ No access token, skipping socket connection');
      return;
    }

    // Connect to socket
    const connectSocket = async () => {
      try {
        console.log('Attempting to connect socket to /chat namespace...');
        console.log('Access token:', accessToken ? 'Present' : 'Missing');

        // Connect socket to /chat namespace
        await socketClient.connect(0, accessToken, '/chat');

        const socket = socketClient.getSocket();
        console.log('Socket obtained:', socket ? 'Yes' : 'No');
        console.log('Socket connected:', socket?.connected);

        if (socket) {
          socket.on('connect', () => {
            console.log('✅ Chat socket connected successfully');
            dispatch({ type: 'SET_CONNECTED', payload: true });
          });

          socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
            dispatch({ type: 'SET_CONNECTED', payload: false });
          });

          socket.on('disconnect', (reason) => {
            console.log('Chat socket disconnected:', reason);
            dispatch({ type: 'SET_CONNECTED', payload: false });
          });

          socket.on('chat:new_message', (data: { roomId: string; message: ChatMessage }) => {
            console.log('📩 Received new message:', data);

            // Always update room's last message
            dispatch({ type: 'UPDATE_ROOM_LAST_MESSAGE', payload: { roomId: data.roomId, message: data.message } });

            // Add to messages (reducer will check if we're in the right room)
            dispatch({ type: 'ADD_MESSAGE_TO_ROOM', payload: { roomId: data.roomId, message: data.message } });
          });

          socket.on('chat:user_typing', (data: { roomId: string; userId: string; isTyping: boolean }) => {
            // Handle typing indicator
            console.log('User typing:', data);
          });

          socket.on('chat:reaction_updated', (data: { messageId: string; userId: string; emoji: string; action: string }) => {
            console.log('👍 Reaction updated:', data);
            dispatch({
              type: 'UPDATE_MESSAGE_REACTION',
              payload: {
                messageId: data.messageId,
                userId: data.userId,
                emoji: data.emoji,
                action: data.action as 'added' | 'removed',
              },
            });
          });

          socket.on('user:online', (data: { userId: string }) => {
            // Update user online status
            console.log('User online:', data);
          });

          socket.on('user:offline', (data: { userId: string }) => {
            // Update user offline status
            console.log('User offline:', data);
          });
        } else {
          console.error('❌ Failed to get socket instance');
        }
      } catch (error) {
        console.error('❌ Error connecting chat socket:', error);
      }
    };

    connectSocket();

    return () => {
      const socket = socketClient.getSocket();
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('chat:new_message');
        socket.off('chat:user_typing');
        socket.off('chat:reaction_updated');
        socket.off('user:online');
        socket.off('user:offline');
      }
    };
  }, [user]);

  const loadRooms = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const rooms = await ChatService.getRooms();
      dispatch({ type: 'SET_ROOMS', payload: rooms });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      console.error('Error loading rooms:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load chat rooms' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadMessages = useCallback(async (roomId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const messages = await ChatService.getMessages(roomId);
      dispatch({ type: 'SET_MESSAGES', payload: messages });

      // Mark room as read
      await ChatService.markRoomAsRead(roomId);

      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      console.error('Error loading messages:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load messages' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const setActiveRoom = useCallback(async (room: ChatRoom | null) => {
    dispatch({ type: 'SET_ACTIVE_ROOM', payload: room });
    if (room) {
      await loadMessages(room.id);

      // Join socket room
      const socket = socketClient.getSocket();
      if (socket && socket.connected) {
        socket.emit('chat:join_room', { roomId: room.id });
      }
    } else {
      dispatch({ type: 'SET_MESSAGES', payload: [] });
    }
  }, [loadMessages]);

  const sendMessage = useCallback((
    content: string,
    type: 'TEXT' | 'IMAGE' | 'ARTWORK' = 'TEXT',
    replyToId?: string
  ) => {
    if (!state.activeRoom) return;

    try {
      const socket = socketClient.getSocket();

      if (!socket || !socket.connected) {
        toast.error('Socket not connected. Please refresh the page.');
        return;
      }

      // Send message via WebSocket
      socket.emit('chat:send_message', {
        roomId: state.activeRoom.id,
        content,
        type,
        replyToId,
      });

      // Message will be added via socket event (chat:new_message)
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  }, [state.activeRoom]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    try {
      const socket = socketClient.getSocket();

      if (!socket || !socket.connected) {
        toast.error('Socket not connected. Please refresh the page.');
        return;
      }

      console.log('Sending reaction:', { messageId, emoji });

      // Send reaction via WebSocket
      socket.emit('chat:add_reaction', {
        messageId,
        emoji,
      });
    } catch (error: any) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  }, []);

  const sendArtwork = useCallback((artwork: FavoriteArtwork) => {
    if (!state.activeRoom) return;

    try {
      const socket = socketClient.getSocket();

      if (!socket || !socket.connected) {
        toast.error('Socket not connected. Please refresh the page.');
        return;
      }

      // Send artwork via WebSocket
      socket.emit('chat:send_message', {
        roomId: state.activeRoom.id,
        content: artwork.title,
        type: 'ARTWORK',
        artworkId: artwork.id,
      });

      dispatch({ type: 'SET_SHOW_FAVORITE_ARTWORKS', payload: false });
      dispatch({ type: 'CLEAR_SELECTED_ARTWORKS' });
    } catch (error: any) {
      console.error('Error sending artwork:', error);
      toast.error('Failed to send artwork');
    }
  }, [state.activeRoom]);

  const createRoom = useCallback(async (participants: ChatUser[]) => {
    if (participants.length === 0) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const room = await ChatService.createRoom({
        type: 'DIRECT',
        participantIds: participants.map(p => p.id),
      });

      // Check if room already exists in the list
      const existingRoomIndex = state.rooms.findIndex(r => r.id === room.id);

      if (existingRoomIndex >= 0) {
        // Room already exists, update it and move to top
        const updatedRooms = [...state.rooms];
        updatedRooms.splice(existingRoomIndex, 1);
        dispatch({ type: 'SET_ROOMS', payload: [room, ...updatedRooms] });
      } else {
        // New room, add to top
        dispatch({ type: 'SET_ROOMS', payload: [room, ...state.rooms] });
      }

      await setActiveRoom(room);
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast.error(error.response?.data?.message || 'Failed to create chat room');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.rooms, setActiveRoom]);

  const searchUsers = useCallback(async (query: string): Promise<ChatUser[]> => {
    try {
      if (!query.trim()) {
        return [];
      }
      return await ChatService.searchUsers(query);
    } catch (error: any) {
      console.error('Error searching users:', error);
      return [];
    }
  }, []);

  const getRecommendedUsers = useCallback(async (): Promise<ChatUser[]> => {
    try {
      return await ChatService.getRecommendedUsers();
    } catch (error: any) {
      console.error('Error fetching recommended users:', error);
      return [];
    }
  }, []);

  const getFavoriteArtworks = useCallback(async (): Promise<FavoriteArtwork[]> => {
    try {
      return await ChatService.getFavoriteArtworks();
    } catch (error: any) {
      console.error('Error fetching favorite artworks:', error);
      return [];
    }
  }, []);

  const selectArtwork = useCallback((artworkId: string) => {
    const currentSelection = state.selectedArtworks || [];
    const isSelected = currentSelection.includes(artworkId);
    if (isSelected) {
      dispatch({
        type: 'SET_SELECTED_ARTWORKS',
        payload: currentSelection.filter(id => id !== artworkId),
      });
    } else {
      dispatch({
        type: 'SET_SELECTED_ARTWORKS',
        payload: [...currentSelection, artworkId],
      });
    }
  }, [state.selectedArtworks]);

  const clearSelectedArtworks = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTED_ARTWORKS' });
  }, []);

  const setShowFavoriteArtworks = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_FAVORITE_ARTWORKS', payload: show });
  }, []);

  const value: ChatContextType = {
    ...state,
    setActiveRoom,
    sendMessage,
    sendArtwork,
    addReaction,
    createRoom,
    searchUsers,
    getRecommendedUsers,
    getFavoriteArtworks,
    selectArtwork,
    clearSelectedArtworks,
    setShowFavoriteArtworks,
    loadRooms,
    loadMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};