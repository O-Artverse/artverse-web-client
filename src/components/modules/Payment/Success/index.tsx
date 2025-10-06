'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from '@phosphor-icons/react';
import { Button, Card, CardBody } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import paymentService from '@/services/payment.service';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');

  const { data: payment, isLoading } = useQuery({
    queryKey: ['payment', orderCode],
    queryFn: () => paymentService.getPaymentByOrderCode(orderCode!),
    enabled: !!orderCode,
  });

  // Redirect to orders if no orderCode
  useEffect(() => {
    if (!orderCode) {
      router.push('/orders');
    }
  }, [orderCode, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-6">
              <CheckCircle size={64} weight="fill" className="text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Details Card */}
        {payment && (
          <Card className="mb-8 bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10">
            <CardBody className="p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Order Details
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Order Number</span>
                  <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {payment.order?.orderNumber || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {payment.paymentMethod === 'PAYOS' ? 'PayOS' : 'Bank Transfer'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="font-bold text-xl text-purple-600 dark:text-purple-400">
                    ${Number(payment.order?.totalAmount || payment.amount).toFixed(2)}
                  </span>
                </div>

                {payment.payosOrderCode && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Transaction Code</span>
                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {payment.payosOrderCode}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Payment Date</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(payment.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button
              className="w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700 font-semibold"
              size="lg"
              startContent={<Package size={20} weight="bold" />}
            >
              View My Orders
            </Button>
          </Link>

          <Link href="/explore">
            <Button
              variant="bordered"
              className="w-full sm:w-auto border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 font-semibold"
              size="lg"
              endContent={<ArrowRight size={20} weight="bold" />}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>What's Next?</strong> We'll send you an email confirmation with your order details.
            Your order will be processed and shipped soon.
          </p>
        </div>
      </div>
    </div>
  );
}
