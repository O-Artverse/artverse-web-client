'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatState, ChatRoom, ChatMessage, ChatUser, FavoriteArtwork } from '@/types/chat';
import socketClient from '@/lib/socket-client';

interface ChatContextType extends ChatState {
  // Actions
  setActiveRoom: (room: ChatRoom | null) => void;
  sendMessage: (content: string, type?: 'text' | 'image' | 'artwork', replyToId?: string) => void;
  sendArtwork: (artwork: FavoriteArtwork) => void;
  createRoom: (participants: ChatUser[]) => void;
  searchUsers: (query: string) => Promise<ChatUser[]>;
  getFavoriteArtworks: () => Promise<FavoriteArtwork[]>;
  selectArtwork: (artworkId: string) => void;
  clearSelectedArtworks: () => void;
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
  | { type: 'UPDATE_ROOM_LAST_MESSAGE'; payload: { roomId: string; message: ChatMessage } }
  | { type: 'SET_SHOW_FAVORITE_ARTWORKS'; payload: boolean }
  | { type: 'SET_SELECTED_ARTWORKS'; payload: string[] }
  | { type: 'CLEAR_SELECTED_ARTWORKS' };

// Mock chat data
const mockUsers: ChatUser[] = [
  { id: 'u_florantial', name: 'Florantial', role: 'exhibition', status: 'online', verified: true },
  { id: 'u_maria', name: 'Maria Greyrat', role: 'artist', status: 'online', verified: true },
];

const mockRooms: ChatRoom[] = mockUsers.map((user, index) => {
  const messages = getMockMessages(`r_${index + 1}`);
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
  
  return {
    id: `r_${index + 1}`,
    name: user.name,
    type: 'direct',
    participants: [user],
    lastMessage,
    unreadCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});
export const mockRecommendedUsers: ChatUser[] = [
  {
    id: '1',
    name: 'Danne Jameholen',
    avatar: '/images/artAnna.png',
    status: 'online',
    role: 'artist',
    verified: true
  },
  {
    id: '2',
    name: 'Flora Wishthen',
    avatar: '/images/avatar.png',
    status: 'online',
    role: 'artist',
    verified: true
  },
  {
    id: '3',
    name: 'Alex Chen',
    avatar: '/images/artAnna.png',
    status: 'offline',
    role: 'exhibition',
    verified: true
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    status: 'online',
    role: 'friend',
    verified: false
  },
  {
    id: '5',
    name: 'Michael Brown',
    avatar: '/images/avatar.png',
    status: 'away',
    role: 'artist',
    verified: true
  }
];
function getMockMessages(roomId: string): ChatMessage[] {
  if (roomId === 'r_1') {
    return [
      { 
        id: 'm_1', 
        roomId: 'r_1', 
        senderId: 'u_florantial', 
        content: 'Hello there, how do your feel about my artwork? Which is the best one you think?', 
        type: 'text', 
        timestamp: new Date(Date.now() - 300000).toISOString() 
      },
      { 
        id: 'm_1b', 
        roomId: 'r_1', 
        senderId: 'current-user', 
        content: 'It really good, I love it!!!', 
        type: 'text', 
        timestamp: new Date(Date.now() - 240000).toISOString() 
      },
      { 
        id: 'm_1c', 
        roomId: 'r_1', 
        senderId: 'u_florantial', 
        content: 'Thank you so much! I really appreciate your feedback.', 
        type: 'text', 
        timestamp: new Date(Date.now() - 180000).toISOString(),
        replyTo: 'm_1b'
      },
      { 
        id: 'm_1d', 
        roomId: 'r_1', 
        senderId: 'current-user', 
        content: 'You are welcome! Keep creating amazing art!', 
        type: 'text', 
        timestamp: new Date(Date.now() - 120000).toISOString(),
        replyTo: 'm_1c'
      },
      { 
        id: 'm_1e', 
        roomId: 'r_1', 
        senderId: 'u_florantial', 
        content: 'Will do! I have some new pieces coming soon.', 
        type: 'text', 
        timestamp: new Date(Date.now() - 60000).toISOString(),
        replyTo: 'm_1d'
      },
    ];
  }
  if (roomId === 'r_2') {
    return [
      { 
        id: 'm_2', 
        roomId: 'r_2', 
        senderId: 'u_maria', 
        content: 'Nice to meet you!', 
        type: 'text', 
        timestamp: new Date(Date.now() - 300000).toISOString() 
      },
      { 
        id: 'm_2b', 
        roomId: 'r_2', 
        senderId: 'current-user', 
        content: 'Nice to meet you too! How are you doing?', 
        type: 'text', 
        timestamp: new Date(Date.now() - 240000).toISOString(),
        replyTo: 'm_2'
      },
      { 
        id: 'm_2c', 
        roomId: 'r_2', 
        senderId: 'u_maria', 
        content: 'I am doing great! Working on some new paintings.', 
        type: 'text', 
        timestamp: new Date(Date.now() - 180000).toISOString(),
        replyTo: 'm_2b'
      },
    ];
  }
  return [];
}

const img = (id: number, w = 1000, ratio = 1.2) => {
  const h = Math.max(400, Math.round(w * ratio));
  return `https://picsum.photos/id/${id}/${w}/${h}.jpg?q=70&v=${id}`;
};

function getMockFavoriteArtworks(): FavoriteArtwork[] {
  return Array.from({ length: 12 }).map((_, i) => {
    const id = i + 1;
    const ratio = 0.75 + ((id % 7) * 0.12);
    const titles = [
      'The Starry Night', 'Sunflowers', 'Girl with a Pearl Earring', 'The Great Wave',
      'Mona Lisa', 'The Scream', 'Water Lilies', 'Guernica',
      'The Birth of Venus', 'American Gothic', 'The Persistence of Memory', 'The Kiss'
    ];
    const authors = [
      'Vincent van Gogh', 'Vincent van Gogh', 'Johannes Vermeer', 'Katsushika Hokusai',
      'Leonardo da Vinci', 'Edvard Munch', 'Claude Monet', 'Pablo Picasso',
      'Sandro Botticelli', 'Grant Wood', 'Salvador Dalí', 'Gustav Klimt'
    ];
    const categories = [
      'Impressionism', 'Impressionism', 'Realism', 'Ukiyo-e',
      'Renaissance', 'Expressionism', 'Impressionism', 'Cubism',
      'Renaissance', 'Regionalism', 'Surrealism', 'Art Nouveau'
    ];
    
    return {
      id: `art_${id}`,
      title: titles[i],
      author: authors[i],
      image: img(50 + id, 1200, ratio),
      category: categories[i],
      ratio
    };
  });
}

const initialState: ChatState & { showFavoriteArtworks: boolean; selectedArtworks: string[] } = {
  rooms: mockRooms,
  activeRoom: null,
  messages: [],
  isConnected: false,
  isLoading: false,
  error: null,
  showFavoriteArtworks: false,
  selectedArtworks: [],
};

function chatReducer(state: typeof initialState, action: ChatAction): typeof initialState {
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
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_ROOM_LAST_MESSAGE':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.roomId
            ? { ...room, lastMessage: action.payload.message }
            : room
        ),
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
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Socket connection
  useEffect(() => {
    const socket = socketClient.getSocket();
    if (socket) {
      socket.on('connect', () => dispatch({ type: 'SET_CONNECTED', payload: true }));
      socket.on('disconnect', () => dispatch({ type: 'SET_CONNECTED', payload: false }));
      socket.on('new_message', (message: ChatMessage) => {
        dispatch({ type: 'ADD_MESSAGE', payload: message });
        if (state.activeRoom?.id === message.roomId) {
          dispatch({ type: 'UPDATE_ROOM_LAST_MESSAGE', payload: { roomId: message.roomId, message } });
        }
      });
    }
  }, [state.activeRoom?.id]);

  const setActiveRoom = (room: ChatRoom | null) => {
    dispatch({ type: 'SET_ACTIVE_ROOM', payload: room });
    if (room) {
      // Load mock messages for selected room
      const msgs = getMockMessages(room.id);
      dispatch({ type: 'SET_MESSAGES', payload: msgs });
    } else {
      dispatch({ type: 'SET_MESSAGES', payload: [] });
    }
  };

  const sendMessage = (content: string, type: 'text' | 'image' | 'artwork' = 'text', replyToId?: string) => {
    if (!state.activeRoom) return;

    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId: state.activeRoom.id,
      senderId: 'current-user', // This should come from auth context
      content,
      type,
      timestamp: new Date().toISOString(),
      replyTo: replyToId,
    };

    socketClient.emit('send_message', message);
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const sendArtwork = (artwork: FavoriteArtwork) => {
    if (!state.activeRoom) return;

    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId: state.activeRoom.id,
      senderId: 'current-user',
      content: ``,
      type: 'artwork',
      timestamp: new Date().toISOString(),
      artwork: {
        id: artwork.id,
        title: artwork.title,
        image: artwork.image,
        author: artwork.author,
        category: artwork.category,
        ratio: artwork.ratio,
      },
    };

    socketClient.emit('send_message', message);
    dispatch({ type: 'ADD_MESSAGE', payload: message });
    dispatch({ type: 'SET_SHOW_FAVORITE_ARTWORKS', payload: false });
    dispatch({ type: 'CLEAR_SELECTED_ARTWORKS' });
  };

  const createRoom = (participants: ChatUser[]) => {
    const user = participants[0];
    const newRoom: ChatRoom = {
      id: `r_${Date.now()}`,
      name: user.name,
      type: 'direct',
      participants: [user],
      unreadCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ChatRoom;

    dispatch({ type: 'SET_ROOMS', payload: [newRoom, ...state.rooms] });
    setActiveRoom(newRoom);
  };
// Mock data for recommended users

  const searchUsers = async (query: string): Promise<ChatUser[]> => {

    return mockRecommendedUsers.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
  };

  const getFavoriteArtworks = async (): Promise<FavoriteArtwork[]> => {
    // Mock implementation - replace with actual API call
    return getMockFavoriteArtworks();
  };

  const selectArtwork = (artworkId: string) => {
    const isSelected = state.selectedArtworks.includes(artworkId);
    if (isSelected) {
      dispatch({
        type: 'SET_SELECTED_ARTWORKS',
        payload: state.selectedArtworks.filter(id => id !== artworkId),
      });
    } else {
      dispatch({
        type: 'SET_SELECTED_ARTWORKS',
        payload: [...state.selectedArtworks, artworkId],
      });
    }
  };

  const clearSelectedArtworks = () => {
    dispatch({ type: 'CLEAR_SELECTED_ARTWORKS' });
  };

  const setShowFavoriteArtworks = (show: boolean) => {
    dispatch({ type: 'SET_SHOW_FAVORITE_ARTWORKS', payload: show });
  };

  const value: ChatContextType = {
    ...state,
    setActiveRoom,
    sendMessage,
    sendArtwork,
    createRoom,
    searchUsers,
    getFavoriteArtworks,
    selectArtwork,
    clearSelectedArtworks,
    setShowFavoriteArtworks,
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