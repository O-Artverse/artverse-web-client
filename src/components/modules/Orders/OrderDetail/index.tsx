'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import orderService from '@/services/order.service';
import { useCancelOrder } from '@/hooks/mutations/order.mutation';
import { getArtworkImageUrl } from '@/utils/imageUtils';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import type { OrderStatus, PaymentStatus } from '@/types/order.types';
import toast from 'react-hot-toast';

const ORDER_STATUS_CONFIG = {
  PENDING: { color: 'warning', icon: Clock, label: 'Pending' },
  PROCESSING: { color: 'primary', icon: Package, label: 'Processing' },
  PAID: { color: 'success', icon: CheckCircle, label: 'Paid' },
  SHIPPED: { color: 'primary', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'success', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'danger', icon: XCircle, label: 'Cancelled' },
  REFUNDED: { color: 'warning', icon: XCircle, label: 'Refunded' },
  FAILED: { color: 'danger', icon: XCircle, label: 'Failed' },
};

const PAYMENT_STATUS_CONFIG = {
  PENDING: { color: 'warning', label: 'Pending' },
  PROCESSING: { color: 'primary', label: 'Processing' },
  COMPLETED: { color: 'success', label: 'Completed' },
  FAILED: { color: 'danger', label: 'Failed' },
  REFUNDED: { color: 'warning', label: 'Refunded' },
  CANCELLED: { color: 'default', label: 'Cancelled' },
};

interface OrderDetailPageProps {
  orderId: string;
}

export default function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const router = useRouter();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
  });

  const cancelOrder = useCancelOrder();

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await cancelOrder.mutateAsync({ orderId });
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Order not found
        </h2>
        <Link href="/orders">
          <Button className="mt-4 bg-purple-600 text-white">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status as OrderStatus];
  const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus as PaymentStatus];
  const StatusIcon = statusConfig.icon;

  const canCancel = ['PENDING', 'PROCESSING'].includes(order.status) && order.paymentStatus !== 'COMPLETED';
  const canPay = order.paymentStatus === 'PENDING';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders">
          <Button isIconOnly variant="light" className="text-gray-600 dark:text-gray-400">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Order Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Order #{order.orderNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Chip color={statusConfig.color as any} variant="flat">
            {statusConfig.label}
          </Chip>
          <Chip color={paymentConfig.color as any} variant="flat">
            {paymentConfig.label}
          </Chip>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10">
            <CardBody className="p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Package size={24} className="text-purple-600 dark:text-purple-400" />
                Order Items ({order.items.length})
              </h2>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-neutral-800"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-700">
                      {item.artwork && (
                        <Image
                          src={getArtworkImageUrl(item.artwork.imageUrl) || ''}
                          alt={item.artwork.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {item.creatorName}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Quantity: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Shipping Information */}
          <Card className="bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10">
            <CardBody className="p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <MapPin size={24} className="text-purple-600 dark:text-purple-400" />
                Shipping Information
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <User size={20} className="text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Recipient</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {order.shippingName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {order.shippingPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {order.shippingAddress}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {order.shippingWard}, {order.shippingDistrict}, {order.shippingCity}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                    <p className="text-sm text-blue-900 dark:text-blue-100">{order.notes}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <Card className="bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 sticky top-4">
            <CardBody className="p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{Number(order.subtotal).toLocaleString('vi-VN')} VND</span>
                </div>

                {Number(order.tax) > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>{Number(order.tax).toLocaleString('vi-VN')} VND</span>
                  </div>
                )}

                {Number(order.shippingFee) > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{Number(order.shippingFee).toLocaleString('vi-VN')} VND</span>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-neutral-700 pt-3"></div>

                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    {Number(order.totalAmount).toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <p>
                  <strong>Order Date:</strong>{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <strong>Last Updated:</strong>{' '}
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                {canPay && (
                  <Link href={`/payment/${order.id}`}>
                    <Button
                      className="w-full bg-purple-600 text-white hover:bg-purple-700 font-semibold"
                      startContent={<CreditCard size={20} weight="bold" />}
                    >
                      Pay Now
                    </Button>
                  </Link>
                )}

                {canCancel && (
                  <Button
                    onClick={handleCancelOrder}
                    isLoading={cancelOrder.isPending}
                    disabled={cancelOrder.isPending}
                    variant="bordered"
                    className="w-full border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    startContent={!cancelOrder.isPending && <XCircle size={20} />}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
