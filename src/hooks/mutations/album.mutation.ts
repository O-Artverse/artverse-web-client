import { useMutation, useQueryClient } from '@tanstack/react-query';
import albumService, {
  CreateAlbumDto,
  UpdateAlbumDto,
  AddArtworkToAlbumDto,
} from '@/services/album.service';
import { albumKeys } from '../queries/album.query';

// Create album
export const useCreateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAlbumDto) => albumService.createAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.myAlbums() });
    },
  });
};

// Update album
export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlbumDto }) =>
      albumService.updateAlbum(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: albumKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: albumKeys.myAlbums() });
    },
  });
};

// Delete album
export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => albumService.deleteAlbum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.myAlbums() });
    },
  });
};

// Add artwork to album
export const useAddArtworkToAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      albumId,
      data,
    }: {
      albumId: string;
      data: AddArtworkToAlbumDto;
    }) => albumService.addArtworkToAlbum(albumId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: albumKeys.detail(variables.albumId),
      });
      queryClient.invalidateQueries({ queryKey: albumKeys.myAlbums() });
    },
  });
};

// Remove artwork from album
export const useRemoveArtworkFromAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      albumId,
      artworkId,
    }: {
      albumId: string;
      artworkId: string;
    }) => albumService.removeArtworkFromAlbum(albumId, artworkId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: albumKeys.detail(variables.albumId),
      });
      queryClient.invalidateQueries({ queryKey: albumKeys.myAlbums() });
    },
  });
};

// Reorder artworks in album
export const useReorderArtworks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      albumId,
      artworkOrders,
    }: {
      albumId: string;
      artworkOrders: Array<{ artworkId: string; order: number }>;
    }) => albumService.reorderArtworks(albumId, artworkOrders),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: albumKeys.detail(variables.albumId),
      });
    },
  });
};