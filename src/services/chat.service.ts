import { ChatRoom, ChatMessage, ChatUser, FavoriteArtwork } from '@/types/chat';
import { chatEndpoint } from '@/settings/endpoints';
import axiosClient from '@/configs/axios-client';

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

  // Create a new chat room
  static async createRoom(participants: ChatUser[]): Promise<ChatRoom> {
    try {
      const response = await axiosClient.post(chatEndpoint.CREATE_ROOM(), {
        participants: participants.map(p => p.id),
        type: 'direct'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  }

  // Get messages for a specific room
  static async getMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const response = await axiosClient.get(chatEndpoint.GET_MESSAGES(roomId));
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a message
  static async sendMessage(roomId: string, content: string, type: 'text' | 'image' | 'artwork' = 'text', artwork?: any): Promise<ChatMessage> {
    try {
      const response = await axiosClient.post(chatEndpoint.POST_MESSAGE(roomId), {
        content,
        type,
        artwork
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Search users
  static async searchUsers(query: string): Promise<ChatUser[]> {
    try {
      const response = await axiosClient.get(`/api/users/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Get favorite artworks
  static async getFavoriteArtworks(): Promise<FavoriteArtwork[]> {
    try {
      const response = await axiosClient.get('/api/artworks/favorites');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite artworks:', error);
      throw error;
    }
  }

  // Add artwork to favorites
  static async addToFavorites(artworkId: string): Promise<void> {
    try {
      await axiosClient.post('/api/artworks/favorites', { artworkId });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  // Remove artwork from favorites
  static async removeFromFavorites(artworkId: string): Promise<void> {
    try {
      await axiosClient.delete(`/api/artworks/favorites/${artworkId}`);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }
} 