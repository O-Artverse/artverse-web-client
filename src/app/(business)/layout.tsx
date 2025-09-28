import type { Metadata } from 'next';
import BusinessLayout from '@/components/layouts/BusinessLayout';

export const metadata: Metadata = {
  title: 'Business Dashboard - Artverse',
  description: 'Manage your art business on Artverse',
};

export default function BusinessLayoutPage({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <BusinessLayout>
      {children}
    </BusinessLayout>
  );
}
