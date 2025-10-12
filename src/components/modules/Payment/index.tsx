'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Bank,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import orderService from '@/services/order.service';
import { useCreatePayment } from '@/hooks/mutations/payment.mutation';
import { PaymentMethod } from '@/types/order.types';
import { Button, RadioGroup, Radio, Card, CardBody } from '@heroui/react';
import toast from 'react-hot-toast';
import StripeCheckout from './StripeCheckout';

interface PaymentPageProps {
  orderId: string;
}

export default function PaymentPage({ orderId }: PaymentPageProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    PaymentMethod.STRIPE,
  );
  const [paymentData, setPaymentData] = useState<any>(null);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    refetchInterval: (query) => {
      // Auto-refresh every 5s if payment is processing
      const data = query.state.data;
      if (
        data?.paymentStatus === 'PROCESSING' ||
        data?.paymentStatus === 'PENDING'
      ) {
        return 5000;
      }
      return false;
    },
  });

  const createPayment = useCreatePayment();

  // Check if order is already paid
  useEffect(() => {
    if (order?.paymentStatus === 'COMPLETED') {
      toast.success('Payment completed!');
      router.push(`/payment/success?orderId=${orderId}`);
    } else if (order?.paymentStatus === 'FAILED') {
      toast.error('Payment failed');
      router.push(`/payment/cancel?orderId=${orderId}`);
    }
  }, [order, router, orderId]);

  const handleCreatePayment = async () => {
    try {
      const result = await createPayment.mutateAsync({
        orderId,
        paymentMethod: selectedMethod,
      });

      setPaymentData(result);

      // For bank transfer, show instructions
      if (result.instructions) {
        toast.success('Please follow the bank transfer instructions');
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleStripeSuccess = () => {
    toast.success('Payment successful!');
    router.push(`/payment/success?orderId=${orderId}`);
  };

  const handleStripeError = (error: string) => {
    toast.error(error);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Order not found
        </h2>
        <Link href="/orders">
          <Button className="mt-4 bg-purple-600 text-white">
            View Orders
          </Button>
        </Link>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'COMPLETED';
  const isPending =
    order.paymentStatus === 'PENDING' || order.paymentStatus === 'PROCESSING';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/orders`}>
          <Button
            isIconOnly
            variant="light"
            className="text-gray-600 dark:text-gray-400"
          >
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Payment
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Order #{order.orderNumber}
          </p>
        </div>
      </div>

      {/* Payment Status Banner */}
      {isPaid && (
        <Card className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <CardBody className="flex flex-row items-center gap-3">
            <CheckCircle
              size={32}
              weight="fill"
              className="text-green-600 dark:text-green-400"
            />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Payment Completed
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your order has been paid successfully
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          {!paymentData && !isPaid && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                Select Payment Method
              </h2>

              <RadioGroup
                value={selectedMethod}
                onValueChange={(value) =>
                  setSelectedMethod(value as PaymentMethod)
                }
              >
                <Radio
                  value={PaymentMethod.STRIPE}
                  classNames={{
                    base: 'bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard
                      size={24}
                      className="text-purple-600 dark:text-purple-400"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Stripe
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Pay with credit card, Apple Pay, Google Pay
                      </div>
                    </div>
                  </div>
                </Radio>

                <Radio
                  value={PaymentMethod.BANK_TRANSFER}
                  classNames={{
                    base: 'bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors mt-3',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Bank
                      size={24}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Bank Transfer
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Manual bank transfer
                      </div>
                    </div>
                  </div>
                </Radio>
              </RadioGroup>

              <Button
                onClick={handleCreatePayment}
                isLoading={createPayment.isPending}
                disabled={createPayment.isPending || isPaid}
                className="w-full mt-6 bg-purple-600 text-white hover:bg-purple-700 font-semibold"
                size="lg"
                startContent={
                  !createPayment.isPending && (
                    <CreditCard size={20} weight="bold" />
                  )
                }
              >
                {createPayment.isPending
                  ? 'Creating Payment...'
                  : 'Continue to Payment'}
              </Button>
            </div>
          )}

          {/* Stripe Checkout */}
          {paymentData &&
            paymentData.clientSecret &&
            paymentData.publishableKey && (
              <StripeCheckout
                clientSecret={paymentData.clientSecret}
                publishableKey={paymentData.publishableKey}
                onSuccess={handleStripeSuccess}
                onError={handleStripeError}
              />
            )}

          {/* Bank Transfer Instructions */}
          {paymentData && paymentData.instructions && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                Bank Transfer Instructions
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">
                    Bank Name
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {paymentData.instructions.bankName}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">
                    Account Number
                  </span>
                  <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {paymentData.instructions.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">
                    Account Name
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {paymentData.instructions.accountName}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">
                    Amount
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {paymentData.instructions.amount} VND
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">
                    Transfer Content
                  </span>
                  <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {paymentData.instructions.content}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> {paymentData.instructions.note}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10 sticky top-4">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>

              {Number(order.tax) > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${Number(order.tax).toFixed(2)}</span>
                </div>
              )}

              {Number(order.shippingFee) > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>${Number(order.shippingFee).toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-neutral-700 pt-3"></div>

              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span className="text-purple-600 dark:text-purple-400">
                  ${Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p className="mb-2">
                <strong>Items:</strong> {order.items.length}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`font-semibold ${
                    isPaid
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
