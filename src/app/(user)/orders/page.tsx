import OrdersPage from '@/components/modules/Orders';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'Track and manage your orders.',
  openGraph: {
    title: 'My Orders | Artverse',
    description: 'Track and manage your orders.',
  },
};

export default function Page() {
  return (
    <div className="h-full overflow-y-auto rounded-xl scrollbar-hide">
      <OrdersPage />
    </div>
  );
}
