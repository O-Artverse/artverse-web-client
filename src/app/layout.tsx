import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import AppProvider from '@/providers/AppProvider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://artverse.vercel.app'),
  title: {
    default: 'Artverse - Discover & Share Digital Art',
    template: '%s | Artverse'
  },
  description: 'Artverse is a vibrant digital art gallery where artists showcase their work, collectors discover unique pieces, and art lovers connect. Explore paintings, sculptures, digital art, and more.',
  keywords: ['digital art', 'art gallery', 'artists', 'artwork', 'paintings', 'sculptures', 'contemporary art', 'art marketplace', 'buy art online'],
  authors: [{ name: 'Artverse Team' }],
  creator: 'Artverse',
  publisher: 'Artverse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Artverse',
    title: 'Artverse - Discover & Share Digital Art',
    description: 'Explore a vibrant digital art gallery featuring paintings, sculptures, digital art, and more from talented artists worldwide.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Artverse - Digital Art Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artverse - Discover & Share Digital Art',
    description: 'Explore a vibrant digital art gallery featuring paintings, sculptures, digital art, and more from talented artists worldwide.',
    images: ['/images/og-image.jpg'],
    creator: '@artverse',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logoIcon.png',
    shortcut: '/images/logoIcon.png',
    apple: '/images/logoIcon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            try {
              let theme = localStorage.getItem('artverse-theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `}
        </Script>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Artverse',
              description: 'Digital art gallery and marketplace for artists and collectors',
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://artverse.vercel.app',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://artverse.vercel.app'}/explore?search={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
              },
              sameAs: [
                'https://twitter.com/artverse',
                'https://facebook.com/artverse',
                'https://instagram.com/artverse'
              ]
            })
          }}
        />
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
