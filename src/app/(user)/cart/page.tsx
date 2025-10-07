import CartPage from '@/components/modules/Cart';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected artworks and proceed to checkout.',
  openGraph: {
    title: 'Shopping Cart | Artverse',
    description: 'Review your selected artworks and proceed to checkout.',
  },
};

export default function Page() {
  return (
    <div className="h-full overflow-y-auto rounded-xl scrollbar-hide">
      <CartPage />
    </div>
  );
}
