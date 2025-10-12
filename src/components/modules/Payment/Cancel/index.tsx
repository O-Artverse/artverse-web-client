'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, ShoppingCart } from '@phosphor-icons/react';
import { Button, Card, CardBody } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import orderService from '@/services/order.service';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderCode = searchParams.get('orderCode');

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId!),
    enabled: !!orderId,
  });

  // Redirect to cart if no orderId or orderCode
  useEffect(() => {
    if (!orderId && !orderCode) {
      router.push('/cart');
    }
  }, [orderId, orderCode, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-red-400 to-red-600 rounded-full p-6">
              <XCircle size={64} weight="fill" className="text-white" />
            </div>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Payment Cancelled
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Your payment has been cancelled. No charges were made to your account.
        </p>

        {/* Order Details Card (if available) */}
        {order && (
          <Card className="mb-8 bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10">
            <CardBody className="p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Order Information
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Order Number</span>
                  <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {order.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                    {Number(order.totalAmount).toLocaleString('vi-VN')} VND
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Order Status</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Items</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {order.items.length} item(s)
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={order ? `/payment/${order.id}` : '/cart'}>
            <Button
              className="w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700 font-semibold"
              size="lg"
              startContent={<ArrowLeft size={20} weight="bold" />}
            >
              {order ? 'Try Again' : 'Back to Cart'}
            </Button>
          </Link>

          <Link href="/explore">
            <Button
              variant="bordered"
              className="w-full sm:w-auto border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 font-semibold"
              size="lg"
              startContent={<ShoppingCart size={20} weight="bold" />}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-900 dark:text-yellow-100">
            <strong>Need Help?</strong> If you encountered any issues during payment, please contact our support team.
            Your order is still saved and you can try again anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
