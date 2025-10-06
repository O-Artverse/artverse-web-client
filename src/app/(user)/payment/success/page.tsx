import PaymentSuccessPage from '@/components/modules/Payment/Success';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Success',
  description: 'Your payment was successful!',
  openGraph: {
    title: 'Payment Success | Artverse',
    description: 'Your payment was successful!',
  },
};

export default function Page() {
  return (
    <div className="h-full overflow-y-auto rounded-xl scrollbar-hide">
      <PaymentSuccessPage />
    </div>
  );
}
