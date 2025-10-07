import OrderDetailPage from '@/components/modules/Orders/OrderDetail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Details',
  description: 'View your order details.',
  openGraph: {
    title: 'Order Details | Artverse',
    description: 'View your order details.',
  },
};

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <div className="h-full overflow-y-auto rounded-xl scrollbar-hide">
      <OrderDetailPage orderId={orderId} />
    </div>
  );
}
