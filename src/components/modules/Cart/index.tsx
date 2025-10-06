'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash,
  Minus,
  Plus,
  ShoppingBag,
  Package,
  ArrowRight,
} from '@phosphor-icons/react';
import { useCart } from '@/hooks/queries/cart.query';
import {
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from '@/hooks/mutations/cart.mutation';
import { getArtworkImageUrl, getImageUrl } from '@/utils/imageUtils';
import { Button } from '@heroui/react';

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading, error } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await updateCartItem.mutateAsync({ itemId, data: { quantity: newQuantity } });
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Remove this item from cart?')) {
      removeFromCart.mutate(itemId);
    }
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart.mutate();
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <Package size={64} className="mb-4 opacity-50" />
        <p className="text-lg">Failed to load cart</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-purple-600 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag
          size={64}
          className="mb-4 text-gray-300 dark:text-gray-700"
        />
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Start adding some amazing artworks!
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
          </p>
        </div>
        {cart.items.length > 0 && (
          <Button
            onClick={handleClearCart}
            isLoading={clearCart.isPending}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            variant="light"
            size="sm"
          >
            Clear Cart
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const isUpdating = updatingItems.has(item.id);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-4 ring-1 ring-black/5 dark:ring-white/10 hover:ring-purple-500/50 dark:hover:ring-purple-400/50 transition-all"
              >
                <div className="flex gap-4">
                  {/* Artwork Image */}
                  <Link
                    href={`/explore/${item.artworkId}`}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800"
                  >
                    <Image
                      src={getArtworkImageUrl(item.artwork.imageUrl) || ''}
                      alt={item.artwork.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </Link>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/explore/${item.artworkId}`}
                          className="font-semibold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2 text-sm sm:text-base"
                        >
                          {item.artwork.title}
                        </Link>
                        <Link
                          href={`/profile/${item.artwork.creator.id}`}
                          className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mt-1 block"
                        >
                          by {item.artwork.creator.firstName}{' '}
                          {item.artwork.creator.lastName}
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.artwork.category.name}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeFromCart.isPending}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash size={20} />
                      </button>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || isUpdating}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} weight="bold" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} weight="bold" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ${Number(item.price).toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10 sticky top-4">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>

              {cart.tax > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
              )}

              {cart.shippingFee > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>${cart.shippingFee.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-neutral-700 pt-3"></div>

              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span className="text-purple-600 dark:text-purple-400">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full mt-6 bg-purple-600 text-white hover:bg-purple-700 font-semibold"
              size="lg"
              endContent={<ArrowRight size={20} weight="bold" />}
            >
              Proceed to Checkout
            </Button>

            <Link href="/explore">
              <Button className="w-full mt-3" variant="light" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
