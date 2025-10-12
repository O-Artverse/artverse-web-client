export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: string;
  orderId: string;
  artworkId: string;
  title: string;
  description?: string;
  imageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  artwork?: {
    id: string;
    title: string;
    imageUrl: string;
    status: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingDistrict?: string;
  shippingWard?: string;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  payments?: Payment[];
  _count?: {
    items: number;
  };
}

export interface CreateOrderDto {
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingDistrict?: string;
  shippingWard?: string;
  notes?: string;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  limit: number;
  offset: number;
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  COD = 'COD',
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  // Stripe specific fields
  stripePaymentIntentId?: string;
  stripeClientSecret?: string;
  stripeCustomerId?: string;
  stripeChargeId?: string;
  // Bank transfer fields
  bankCode?: string;
  bankAccount?: string;
  transactionData?: any;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failedAt?: string;
  order?: Order;
}

export interface CreatePaymentDto {
  orderId: string;
  paymentMethod: PaymentMethod;
  bankCode?: string;
}

export interface CreatePaymentResponse {
  payment: Payment;
  // Stripe response
  clientSecret?: string;
  paymentIntentId?: string;
  publishableKey?: string;
  // Bank transfer response
  instructions?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: string;
    content: string;
    note: string;
  };
}
