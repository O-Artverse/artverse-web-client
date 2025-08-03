import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { PostService } from '@/services/posts.service';

export const useGetPosts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.all(),
    queryFn: PostService.getPosts,
  });
};

export const useGetPost = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.detail(id),
    queryFn: () => PostService.getPost(id),
    enabled: !!id,
  });
}; 