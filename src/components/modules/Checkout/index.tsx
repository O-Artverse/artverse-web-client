'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, CreditCard, ShoppingBag } from '@phosphor-icons/react';
import { useCart } from '@/hooks/queries/cart.query';
import { useCreateOrder } from '@/hooks/mutations/order.mutation';
import { getArtworkImageUrl } from '@/utils/imageUtils';
import { Button, Input, Textarea } from '@heroui/react';
import { useForm } from 'react-hook-form';
import type { CreateOrderDto } from '@/types/order.types';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderDto>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CreateOrderDto) => {
    setIsSubmitting(true);
    try {
      const order = await createOrder.mutateAsync(data);
      // Redirect to payment page
      router.push(`/payment/${order.id}`);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag size={64} className="mb-4 text-gray-300 dark:text-gray-700" />
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Add items to cart before checkout
        </p>
        <Link href="/explore">
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            Explore Artworks
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/cart">
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
            Checkout
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete your order
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Package size={24} className="text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Shipping Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    {...register('shippingName')}
                    isInvalid={!!errors.shippingName}
                    errorMessage={errors.shippingName?.message}
                    classNames={{
                      input: 'dark:bg-neutral-800',
                      inputWrapper: 'dark:bg-neutral-800',
                    }}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+84 901 234 567"
                    {...register('shippingPhone')}
                    isInvalid={!!errors.shippingPhone}
                    errorMessage={errors.shippingPhone?.message}
                    classNames={{
                      input: 'dark:bg-neutral-800',
                      inputWrapper: 'dark:bg-neutral-800',
                    }}
                  />
                </div>

                <Input
                  label="Address"
                  placeholder="Street address"
                  {...register('shippingAddress')}
                  isInvalid={!!errors.shippingAddress}
                  errorMessage={errors.shippingAddress?.message}
                  classNames={{
                    input: 'dark:bg-neutral-800',
                    inputWrapper: 'dark:bg-neutral-800',
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    placeholder="City"
                    {...register('shippingCity')}
                    isInvalid={!!errors.shippingCity}
                    errorMessage={errors.shippingCity?.message}
                    classNames={{
                      input: 'dark:bg-neutral-800',
                      inputWrapper: 'dark:bg-neutral-800',
                    }}
                  />
                  <Input
                    label="District"
                    placeholder="District"
                    {...register('shippingDistrict')}
                    isInvalid={!!errors.shippingDistrict}
                    errorMessage={errors.shippingDistrict?.message}
                    classNames={{
                      input: 'dark:bg-neutral-800',
                      inputWrapper: 'dark:bg-neutral-800',
                    }}
                  />
                  <Input
                    label="Ward"
                    placeholder="Ward"
                    {...register('shippingWard')}
                    isInvalid={!!errors.shippingWard}
                    errorMessage={errors.shippingWard?.message}
                    classNames={{
                      input: 'dark:bg-neutral-800',
                      inputWrapper: 'dark:bg-neutral-800',
                    }}
                  />
                </div>

                <Textarea
                  label="Notes (Optional)"
                  placeholder="Add delivery instructions or notes..."
                  {...register('notes')}
                  minRows={3}
                  classNames={{
                    input: 'dark:bg-neutral-800',
                    inputWrapper: 'dark:bg-neutral-800',
                  }}
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                Order Items ({cart.totalItems})
              </h2>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-neutral-800"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-700">
                      <Image
                        src={item.artwork.imageUrl || ''}
                        alt={item.artwork.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                        {item.artwork.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        by {item.artwork.creator.firstName}{' '}
                        {item.artwork.creator.lastName}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10 sticky top-4">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{Number(cart.subtotal).toLocaleString('vi-VN')} VND</span>
                </div>

                {Number(cart.tax) > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>{Number(cart.tax).toLocaleString('vi-VN')} VND</span>
                  </div>
                )}

                {Number(cart.shippingFee) > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{Number(cart.shippingFee).toLocaleString('vi-VN')} VND</span>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-neutral-700 pt-3"></div>

                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    {Number(cart.total).toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white hover:bg-purple-700 font-semibold"
                size="lg"
                startContent={!isSubmitting && <CreditCard size={20} weight="bold" />}
              >
                {isSubmitting ? 'Creating Order...' : 'Proceed to Payment'}
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
