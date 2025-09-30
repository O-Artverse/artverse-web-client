import { ChatRoom, ChatMessage, ChatUser, FavoriteArtwork } from '@/types/chat';
import { chatEndpoint } from '@/settings/endpoints';
import axiosClient from '@/configs/axios-client';
import { getArtworkImageUrl } from '@/utils/imageUtils';

export interface CreateRoomDto {
  name?: string;
  type: 'DIRECT' | 'GROUP' | 'EXHIBITION';
  participantIds: string[];
}

export interface SendMessageDto {
  content: string;
  type: 'TEXT' | 'IMAGE' | 'ARTWORK' | 'SYSTEM';
  artworkId?: string;
  replyToId?: string;
}

export interface AddReactionDto {
  emoji: string;
}

export class ChatService {
  // Get all chat rooms
  static async getRooms(): Promise<ChatRoom[]> {
    try {
      const response = await axiosClient.get(chatEndpoint.GET_ROOMS());
      return response.data;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  }

  // Create a new chat room or get existing direct room
  static async createRoom(dto: CreateRoomDto): Promise<ChatRoom> {
    try {
      const response = await axiosClient.post(chatEndpoint.CREATE_ROOM(), dto);
      return response.data;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  }

  // Get room by ID
  static async getRoomById(roomId: string): Promise<ChatRoom> {
    try {
      const response = await axiosClient.get(chatEndpoint.GET_ROOM(roomId));
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  // Get messages for a specific room
  static async getMessages(roomId: string, page: number = 1, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const response = await axiosClient.get(chatEndpoint.GET_MESSAGES(roomId), {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a message
  static async sendMessage(roomId: string, dto: SendMessageDto): Promise<ChatMessage> {
    try {
      const response = await axiosClient.post(chatEndpoint.POST_MESSAGE(roomId), dto);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark room as read
  static async markRoomAsRead(roomId: string): Promise<{ success: boolean }> {
    try {
      const response = await axiosClient.post(chatEndpoint.MARK_READ(roomId));
      return response.data;
    } catch (error) {
      console.error('Error marking room as read:', error);
      throw error;
    }
  }

  // Add or remove reaction
  static async addReaction(messageId: string, dto: AddReactionDto): Promise<{ action: 'added' | 'removed' }> {
    try {
      const response = await axiosClient.post(chatEndpoint.ADD_REACTION(messageId), dto);
      return response.data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  // Search users
  static async searchUsers(query: string): Promise<ChatUser[]> {
    try {
      const response = await axiosClient.get(chatEndpoint.SEARCH_USERS(), {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Get recommended users
  static async getRecommendedUsers(): Promise<ChatUser[]> {
    try {
      const response = await axiosClient.get(chatEndpoint.RECOMMENDED_USERS());
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended users:', error);
      throw error;
    }
  }

  // Get favorite artworks (from saved artworks)
  static async getFavoriteArtworks(): Promise<FavoriteArtwork[]> {
    try {
      const response = await axiosClient.get('/artworks', {
        params: {
          saved: true,
          limit: 50,
        },
      });

      if (!response.data || !response.data.data) {
        return [];
      }

      return response.data.data.map((artwork: any) => ({
        id: artwork.id,
        title: artwork.title,
        author: `${artwork.creator.firstName} ${artwork.creator.lastName}`,
        image: getArtworkImageUrl(artwork.thumbnailUrl || artwork.imageUrl) || '',
        category: artwork.category.name,
        ratio: artwork.height / artwork.width,
      }));
    } catch (error) {
      console.error('Error fetching favorite artworks:', error);
      return [];
    }
  }
} 