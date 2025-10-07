import CheckoutPage from '@/components/modules/Checkout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order and proceed to payment.',
  openGraph: {
    title: 'Checkout | Artverse',
    description: 'Complete your order and proceed to payment.',
  },
};

export default function Page() {
  return (
    <div className="h-full overflow-y-auto rounded-xl scrollbar-hide">
      <CheckoutPage />
    </div>
  );
}
