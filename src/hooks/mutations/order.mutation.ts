import { useMutation, useQueryClient } from '@tanstack/react-query';
import orderService from '@/services/order.service';
import type { CreateOrderDto } from '@/types/order.types';
import toast from 'react-hot-toast';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create order');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      orderService.cancelOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });
};
