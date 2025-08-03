'use client';

import { useGetPosts } from '@/hooks/queries/posts.query';
import { useCreatePost, useDeletePost } from '@/hooks/mutations/posts.mutation';
import { useState } from 'react';
import type { CreatePostDto } from '@/types/post';

export default function PostList() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const { data: posts, isLoading, error } = useGetPosts();
  const createPost = useCreatePost();
  const deletePost = useDeletePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: CreatePostDto = {
      title,
      body,
      userId: 1, // Hardcoded for demo
    };
    createPost.mutate(newPost, {
      onSuccess: () => {
        setTitle('');
        setBody('');
      },
    });
  };

  if (isLoading) return <div className="text-foreground">Loading...</div>;
  if (error) return <div className="text-foreground">Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Posts</h1>

      {/* Create Post Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-background text-foreground border-gray-300 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded bg-background text-foreground border-gray-300 dark:border-gray-600"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          disabled={createPost.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {createPost.isPending ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      {/* Posts List */}
      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="border p-4 rounded bg-background border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{post.title}</h2>
                <p className="mt-2 text-foreground">{post.body}</p>
              </div>
              <button
                onClick={() => deletePost.mutate(post.id)}
                className="text-red-500 hover:text-red-700"
                disabled={deletePost.isPending}
              >
                {deletePost.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 