import axios from 'axios';
import { Post, CreatePostDto } from '@/types/post';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const PostService = {
  async getPosts(): Promise<Post[]> {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  },

  async getPost(id: number): Promise<Post> {
    const response = await axios.get(`${API_URL}/posts/${id}`);
    return response.data;
  },

  async createPost(data: CreatePostDto): Promise<Post> {
    const response = await axios.post(`${API_URL}/posts`, data);
    return response.data;
  },

  async updatePost(id: number, data: Partial<Post>): Promise<Post> {
    const response = await axios.patch(`${API_URL}/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id: number): Promise<void> {
    await axios.delete(`${API_URL}/posts/${id}`);
  },
}; 