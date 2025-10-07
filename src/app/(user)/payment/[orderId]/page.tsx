import PaymentPage from '@/components/modules/Payment';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment',
  description: 'Complete your payment securely with PayOS.',
  openGraph: {
    title: 'Payment | Artverse',
    description: 'Complete your payment securely with PayOS.',
  },
};

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <div className="h-full overflow-y-auto rounded-xl scrollbar-hide">
      <PaymentPage orderId={orderId} />
    </div>
  );
}
