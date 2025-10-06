import axiosClient from '@/configs/axios-client';
import type {
  Order,
  CreateOrderDto,
  OrderListResponse,
  OrderStatus,
} from '@/types/order.types';

class OrderService {
  private readonly BASE_URL = '/orders';

  // Create order from cart
  async createOrder(data: CreateOrderDto): Promise<Order> {
    const response = await axiosClient.post<Order>(this.BASE_URL, data);
    return response.data;
  }

  // Get all user orders
  async getOrders(params?: {
    status?: OrderStatus;
    limit?: number;
    offset?: number;
  }): Promise<OrderListResponse> {
    const response = await axiosClient.get<OrderListResponse>(this.BASE_URL, {
      params,
    });
    return response.data;
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
    const response = await axiosClient.get<Order>(`${this.BASE_URL}/${orderId}`);
    return response.data;
  }

  // Cancel order
  async cancelOrder(
    orderId: string,
    reason?: string,
  ): Promise<Order> {
    const response = await axiosClient.delete<Order>(
      `${this.BASE_URL}/${orderId}/cancel`,
      { data: { reason } },
    );
    return response.data;
  }
}

export default new OrderService();
