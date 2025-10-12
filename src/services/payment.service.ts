import axiosClient from '@/configs/axios-client';
import type {
  Payment,
  CreatePaymentDto,
  CreatePaymentResponse,
} from '@/types/order.types';

class PaymentService {
  private readonly BASE_URL = '/payments';

  // Create payment for an order
  async createPayment(data: CreatePaymentDto): Promise<CreatePaymentResponse> {
    const response = await axiosClient.post<CreatePaymentResponse>(
      this.BASE_URL,
      data,
    );
    return response.data;
  }

  // Get payments for an order
  async getPaymentsByOrder(orderId: string): Promise<Payment[]> {
    const response = await axiosClient.get<Payment[]>(
      `${this.BASE_URL}/order/${orderId}`,
    );
    return response.data;
  }

  // Check Stripe payment status
  async checkStripeStatus(paymentIntentId: string): Promise<any> {
    const response = await axiosClient.get(
      `${this.BASE_URL}/stripe/status/${paymentIntentId}`,
    );
    return response.data;
  }

  // Get payment by Stripe PaymentIntent ID
  async getPaymentByPaymentIntentId(paymentIntentId: string): Promise<Payment> {
    const response = await axiosClient.get<Payment>(
      `${this.BASE_URL}/stripe/payment-intent/${paymentIntentId}`,
    );
    return response.data;
  }

  // Cancel payment
  async cancelPayment(paymentId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<{ message: string }>(
      `${this.BASE_URL}/${paymentId}/cancel`,
    );
    return response.data;
  }

  // Refund payment (new feature)
  async refundPayment(
    paymentId: string,
    reason?: string,
  ): Promise<{ message: string; refundId?: string }> {
    const response = await axiosClient.post<{
      message: string;
      refundId?: string;
    }>(`${this.BASE_URL}/${paymentId}/refund`, { reason });
    return response.data;
  }
}

export default new PaymentService();
