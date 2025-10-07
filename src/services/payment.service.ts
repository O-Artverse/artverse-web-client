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

  // Check PayOS payment status
  async checkPayOSStatus(orderCode: number): Promise<any> {
    const response = await axiosClient.get(
      `${this.BASE_URL}/payos/status/${orderCode}`,
    );
    return response.data;
  }

  // Get payment by PayOS order code
  async getPaymentByOrderCode(orderCode: string): Promise<Payment> {
    const response = await axiosClient.get<Payment>(
      `${this.BASE_URL}/payos/orderCode/${orderCode}`,
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
}

export default new PaymentService();
