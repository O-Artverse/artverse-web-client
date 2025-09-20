export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  role?: 'artist' | 'exhibition' | 'friend' | 'user';
  verified?: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'artwork' | 'system';
  timestamp: string;
  edited?: boolean;
  replyTo?: string;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  artwork?: {
    id: string;
    title: string;
    image: string;
    author: string;
    category: string;
    ratio: number;
    width?: number;
    height?: number;
  };
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size: number;
  }[];
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'exhibition';
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface FavoriteArtwork {
  id: string;
  title: string;
  author: string;
  image: string;
  category: string;
  ratio: number;
}

export interface ChatSearchFilters {
  category?: string;
  status?: 'online' | 'offline' | 'all';
  role?: 'artist' | 'exhibition' | 'friend' | 'user' | 'all';
}

export interface ChatNotification {
  id: string;
  type: 'message' | 'mention' | 'artwork_shared';
  roomId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
