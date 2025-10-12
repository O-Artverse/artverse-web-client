'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@heroui/react';
import { CreditCard, CheckCircle, XCircle } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

interface StripeCheckoutFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ onSuccess, onError }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'An error occurred during payment');
        onError(error.message || 'Payment failed');
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess();
      } else if (paymentIntent) {
        // Handle other statuses (processing, requires_action, etc.)
        setMessage(`Payment status: ${paymentIntent.status}`);
        toast.loading('Processing payment...');
      }
    } catch (err: any) {
      setMessage(err.message || 'An unexpected error occurred');
      onError(err.message);
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              email: '',
            },
          },
        }}
      />

      {message && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-900 dark:text-red-100">{message}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        isLoading={isProcessing}
        className="w-full bg-purple-600 text-white hover:bg-purple-700 font-semibold"
        size="lg"
        startContent={
          !isProcessing && <CreditCard size={20} weight="bold" />
        }
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Powered by Stripe - Your payment information is secure
      </p>
    </form>
  );
}

interface StripeCheckoutProps {
  clientSecret: string;
  publishableKey: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripeCheckout({
  clientSecret,
  publishableKey,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);

  if (!clientSecret || !stripePromise) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
        Complete Payment with Stripe
      </h2>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#9333ea',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#ef4444',
              fontFamily: 'Inter, system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '12px',
            },
          },
        }}
      >
        <CheckoutForm onSuccess={onSuccess} onError={onError} />
      </Elements>
    </div>
  );
}
