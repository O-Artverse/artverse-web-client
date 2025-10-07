export interface CartItem {
  id: string;
  cartId: string;
  artworkId: string;
  quantity: number;
  price: number;
  addedAt: string;
  updatedAt: string;
  artwork: {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    creator: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    category: {
      id: string;
      name: string;
    };
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  totalItems: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
}

export interface AddToCartDto {
  artworkId: string;
  quantity?: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
