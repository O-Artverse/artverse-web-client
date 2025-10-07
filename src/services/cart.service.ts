import axiosClient from '@/configs/axios-client';
import type {
  Cart,
  CartItem,
  AddToCartDto,
  UpdateCartItemDto,
} from '@/types/cart.types';

class CartService {
  private readonly BASE_URL = '/cart';

  // Get user cart
  async getCart(): Promise<Cart> {
    const response = await axiosClient.get<Cart>(this.BASE_URL);
    return response.data;
  }

  // Add item to cart
  async addToCart(data: AddToCartDto): Promise<CartItem> {
    const response = await axiosClient.post<CartItem>(
      `${this.BASE_URL}/items`,
      data,
    );
    return response.data;
  }

  // Update cart item quantity
  async updateCartItem(
    itemId: string,
    data: UpdateCartItemDto,
  ): Promise<CartItem> {
    const response = await axiosClient.patch<CartItem>(
      `${this.BASE_URL}/items/${itemId}`,
      data,
    );
    return response.data;
  }

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<{ message: string }>(
      `${this.BASE_URL}/items/${itemId}`,
    );
    return response.data;
  }

  // Clear cart
  async clearCart(): Promise<{ message: string }> {
    const response = await axiosClient.delete<{ message: string }>(
      this.BASE_URL,
    );
    return response.data;
  }
}

export default new CartService();
