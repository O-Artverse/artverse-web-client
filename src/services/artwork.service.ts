import axiosClient from '@/configs/axios-client';

export interface ArtworkCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string | null;
  _count?: {
    artworks: number;
  };
}

export interface AudioSubtitle {
  id: string;
  language: string;
  label: string;
  vttUrl: string;
  artworkId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  price?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  medium?: string;
  dimensions?: string;
  year?: number;
  tags: string[];
  backgroundMusicUrl?: string;
  descriptionAudioUrl?: string;
  audioSubtitles?: AudioSubtitle[];
  creatorId: string;
  creator: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    description?: string;
  };
  categoryId: string;
  category: ArtworkCategory;
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
    avatar?: string;
    description?: string;
  };
  _count?: {
    likes: number;
    savedBy: number;
  };
  likes?: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  }>;
}

export interface CreateArtworkDto {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  price?: number;
  categoryId: string;
  organizationId?: string;
  medium?: string;
  dimensions?: string;
  year?: number;
  tags?: string[];
  backgroundMusicUrl?: string;
  descriptionAudioUrl?: string;
}

export interface UpdateArtworkDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  price?: number;
  categoryId?: string;
  organizationId?: string;
  medium?: string;
  dimensions?: string;
  year?: number;
  tags?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  backgroundMusicUrl?: string;
  descriptionAudioUrl?: string;
}

export interface AudioSubtitleDto {
  language: string;
  label: string;
  vttUrl: string;
}

export interface ArtworkComment {
  id: string;
  content: string;
  likeCount: number;
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
  artworkId: string;
  parentId?: string;
  replies?: ArtworkComment[];
  likes?: Array<{ id: string; userId: string }>;
}

export interface CreateCommentDto {
  content: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
}

export interface SearchArtist {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  description?: string;
  _count?: {
    artworks: number;
  };
}

export interface SearchResult {
  artworks: Artwork[];
  artists: SearchArtist[];
  categories: ArtworkCategory[];
}

const artworkService = {
  // Upload artwork image
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/artworks/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all artworks with filters
  async getArtworks(params?: {
    search?: string;
    categoryId?: string;
    status?: string;
    creatorId?: string;
    organizationId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    data: Artwork[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const response = await axiosClient.get('/artworks', { params });
    return response.data;
  },

  // Get single artwork by ID
  async getArtworkById(id: string): Promise<Artwork> {
    const response = await axiosClient.get(`/artworks/${id}`);
    return response.data;
  },

  // Create artwork
  async createArtwork(data: CreateArtworkDto): Promise<Artwork> {
    const response = await axiosClient.post('/artworks', data);
    return response.data;
  },

  // Update artwork
  async updateArtwork(id: string, data: UpdateArtworkDto): Promise<Artwork> {
    const response = await axiosClient.patch(`/artworks/${id}`, data);
    return response.data;
  },

  // Delete artwork
  async deleteArtwork(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/artworks/${id}`);
    return response.data;
  },

  // Like/Unlike artwork
  async toggleLike(id: string): Promise<{ liked: boolean; likeCount: number }> {
    const response = await axiosClient.post(`/artworks/${id}/like`);
    return response.data;
  },

  // Save/Unsave artwork
  async toggleSave(id: string): Promise<{ saved: boolean }> {
    const response = await axiosClient.post(`/artworks/${id}/save`);
    return response.data;
  },

  // Get user's saved artworks
  async getSavedArtworks(): Promise<Artwork[]> {
    const response = await axiosClient.get('/artworks/saved');
    return response.data;
  },

  // Get artwork categories
  async getCategories(): Promise<ArtworkCategory[]> {
    const response = await axiosClient.get('/artworks/categories');
    return response.data;
  },

  // ========== COMMENTS ==========

  // Get comments for an artwork
  async getComments(artworkId: string): Promise<ArtworkComment[]> {
    const response = await axiosClient.get(`/artworks/${artworkId}/comments`);
    return response.data;
  },

  // Create a comment
  async createComment(artworkId: string, data: CreateCommentDto): Promise<ArtworkComment> {
    const response = await axiosClient.post(`/artworks/${artworkId}/comments`, data);
    return response.data;
  },

  // Update a comment
  async updateComment(commentId: string, data: UpdateCommentDto): Promise<ArtworkComment> {
    const response = await axiosClient.patch(`/artworks/comments/${commentId}`, data);
    return response.data;
  },

  // Delete a comment
  async deleteComment(commentId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/artworks/comments/${commentId}`);
    return response.data;
  },

  // Like/Unlike a comment
  async toggleCommentLike(commentId: string): Promise<{ liked: boolean; likeCount: number }> {
    const response = await axiosClient.post(`/artworks/comments/${commentId}/like`);
    return response.data;
  },

  // ========== SEARCH ==========

  // Search artworks, artists, and categories
  async search(params?: { q?: string; limit?: number }): Promise<SearchResult> {
    const response = await axiosClient.get('/artworks/search', { params });
    return response.data;
  },

  // Get search suggestions for autocomplete
  async getSearchSuggestions(params?: { q?: string; limit?: number }): Promise<SearchSuggestion[]> {
    const response = await axiosClient.get('/artworks/search/suggestions', { params });
    return response.data;
  },

  // ========== AUDIO FILES ==========

  // Upload audio file (music or description)
  async uploadAudio(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/artworks/upload-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload VTT subtitle file
  async uploadVtt(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/artworks/upload-vtt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ========== AUDIO SUBTITLES ==========

  // Get all subtitles for an artwork
  async getSubtitles(artworkId: string): Promise<AudioSubtitle[]> {
    const response = await axiosClient.get(`/artworks/${artworkId}/subtitles`);
    return response.data;
  },

  // Add or update subtitle for artwork
  async upsertSubtitle(artworkId: string, data: AudioSubtitleDto): Promise<AudioSubtitle> {
    const response = await axiosClient.post(`/artworks/${artworkId}/subtitles`, data);
    return response.data;
  },

  // Delete subtitle
  async deleteSubtitle(artworkId: string, language: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/artworks/${artworkId}/subtitles/${language}`);
    return response.data;
  },
};

export default artworkService;