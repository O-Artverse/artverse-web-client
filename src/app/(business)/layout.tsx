import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Dashboard - Artverse',
  description: 'Manage your art business on Artverse',
};

export default function BusinessLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}
