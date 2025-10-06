'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import orderService from '@/services/order.service';
import { getArtworkImageUrl } from '@/utils/imageUtils';
import { Button, Card, CardBody, CardHeader, Chip, Select, SelectItem } from '@heroui/react';
import type { OrderStatus, PaymentStatus } from '@/types/order.types';

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

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, limit, statusFilter],
    queryFn: () => orderService.getOrders({
      offset: (page - 1) * limit,
      limit,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    }),
  });

  const orders = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track and manage your orders
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Select
          label="Filter by Status"
          placeholder="All Orders"
          selectedKeys={[statusFilter]}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
          className="max-w-xs"
          classNames={{
            trigger: 'bg-white dark:bg-neutral-900',
          }}
        >
          <SelectItem key="ALL">All Orders</SelectItem>
          <SelectItem key="PENDING">Pending</SelectItem>
          <SelectItem key="PROCESSING">Processing</SelectItem>
          <SelectItem key="PAID">Paid</SelectItem>
          <SelectItem key="SHIPPED">Shipped</SelectItem>
          <SelectItem key="DELIVERED">Delivered</SelectItem>
          <SelectItem key="CANCELLED">Cancelled</SelectItem>
        </Select>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Package size={64} className="mb-4 text-gray-300 dark:text-gray-700" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            No orders found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {statusFilter === 'ALL'
              ? "You haven't placed any orders yet"
              : `No orders with status: ${statusFilter}`
            }
          </p>
          <Link href="/explore">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = ORDER_STATUS_CONFIG[order.status as OrderStatus];
            const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus as PaymentStatus];
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={order.id}
                className="bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10"
              >
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3">
                  <div className="flex items-center gap-3">
                    <StatusIcon size={24} className="text-purple-600 dark:text-purple-400" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Chip
                      color={statusConfig.color as any}
                      variant="flat"
                      size="sm"
                    >
                      {statusConfig.label}
                    </Chip>
                    <Chip
                      color={paymentConfig.color as any}
                      variant="flat"
                      size="sm"
                      startContent={<CreditCard size={14} />}
                    >
                      {paymentConfig.label}
                    </Chip>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800"
                        >
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
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {order.items.length} item(s)
                      </span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <Link href={`/orders/${order.id}`} className="flex-1 sm:flex-none">
                        <Button
                          variant="bordered"
                          className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
                          size="sm"
                          startContent={<Eye size={16} />}
                        >
                          View Details
                        </Button>
                      </Link>

                      {order.paymentStatus === 'PENDING' && (
                        <Link href={`/payment/${order.id}`} className="flex-1 sm:flex-none">
                          <Button
                            className="w-full bg-purple-600 text-white hover:bg-purple-700"
                            size="sm"
                            startContent={<CreditCard size={16} />}
                          >
                            Pay Now
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            isDisabled={page === 1}
            onClick={() => setPage(page - 1)}
            variant="bordered"
            size="sm"
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            isDisabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            variant="bordered"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
