import { useMutation, useQueryClient } from '@tanstack/react-query';
import artworkService, {
  CreateArtworkDto,
  UpdateArtworkDto,
} from '@/services/artwork.service';
import { artworkKeys } from '../queries/artwork.query';

// Create artwork
export const useCreateArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArtworkDto) =>
      artworkService.createArtwork(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: artworkKeys.lists() });
    },
  });
};

// Update artwork
export const useUpdateArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArtworkDto }) =>
      artworkService.updateArtwork(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: artworkKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: artworkKeys.lists() });
    },
  });
};

// Delete artwork
export const useDeleteArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => artworkService.deleteArtwork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: artworkKeys.lists() });
    },
  });
};

// Toggle like
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => artworkService.toggleLike(id),
    onSuccess: (_, artworkId) => {
      queryClient.invalidateQueries({
        queryKey: artworkKeys.detail(artworkId),
      });
      queryClient.invalidateQueries({ queryKey: artworkKeys.lists() });
    },
  });
};

// Toggle save
export const useToggleSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => artworkService.toggleSave(id),
    onSuccess: (_, artworkId) => {
      queryClient.invalidateQueries({
        queryKey: artworkKeys.detail(artworkId),
      });
      queryClient.invalidateQueries({ queryKey: artworkKeys.saved() });
    },
  });
};