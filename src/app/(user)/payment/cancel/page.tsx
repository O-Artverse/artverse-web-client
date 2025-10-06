import PaymentCancelPage from '@/components/modules/Payment/Cancel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Cancelled',
  description: 'Your payment was cancelled.',
  openGraph: {
    title: 'Payment Cancelled | Artverse',
    description: 'Your payment was cancelled.',
  },
};

export default function Page() {
  return (
    <div className="h-full overflow-y-auto rounded-xl scrollbar-hide">
      <PaymentCancelPage />
    </div>
  );
}
