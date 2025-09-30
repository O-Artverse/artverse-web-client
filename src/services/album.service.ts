import axiosClient from '@/configs/axios-client';
import type { Artwork } from './artwork.service';

export interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS_ONLY';
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  artworks?: Array<{
    id: string;
    addedAt: string;
    order: number;
    artwork: Artwork;
  }>;
  _count?: {
    artworks: number;
  };
}

export interface CreateAlbumDto {
  name: string;
  description?: string;
  coverImage?: string;
  privacy?: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS_ONLY';
  isFavorite?: boolean;
}

export interface UpdateAlbumDto {
  name?: string;
  description?: string;
  coverImage?: string;
  privacy?: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS_ONLY';
  isFavorite?: boolean;
}

export interface AddArtworkToAlbumDto {
  artworkId: string;
  order?: number;
}

const albumService = {
  // Get current user's albums
  async getMyAlbums(): Promise<Album[]> {
    const response = await axiosClient.get('/albums/my-albums');
    return response.data;
  },

  // Get user's public albums
  async getUserAlbums(userId: string): Promise<Album[]> {
    const response = await axiosClient.get(`/albums/user/${userId}`);
    return response.data;
  },

  // Get album by ID
  async getAlbumById(id: string): Promise<Album> {
    const response = await axiosClient.get(`/albums/${id}`);
    return response.data;
  },

  // Create album
  async createAlbum(data: CreateAlbumDto): Promise<Album> {
    const response = await axiosClient.post('/albums', data);
    return response.data;
  },

  // Update album
  async updateAlbum(id: string, data: UpdateAlbumDto): Promise<Album> {
    const response = await axiosClient.patch(`/albums/${id}`, data);
    return response.data;
  },

  // Delete album
  async deleteAlbum(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/albums/${id}`);
    return response.data;
  },

  // Add artwork to album
  async addArtworkToAlbum(
    albumId: string,
    data: AddArtworkToAlbumDto,
  ): Promise<any> {
    const response = await axiosClient.post(`/albums/${albumId}/artworks`, data);
    return response.data;
  },

  // Remove artwork from album
  async removeArtworkFromAlbum(
    albumId: string,
    artworkId: string,
  ): Promise<{ message: string }> {
    const response = await axiosClient.delete(
      `/albums/${albumId}/artworks/${artworkId}`,
    );
    return response.data;
  },

  // Reorder artworks in album
  async reorderArtworks(
    albumId: string,
    artworkOrders: Array<{ artworkId: string; order: number }>,
  ): Promise<{ message: string }> {
    const response = await axiosClient.patch(`/albums/${albumId}/reorder`, {
      artworkOrders,
    });
    return response.data;
  },
};

export default albumService;