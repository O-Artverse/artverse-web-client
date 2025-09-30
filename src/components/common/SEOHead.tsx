'use client'

import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export default function SEOHead({
  title = 'Artverse - Discover & Share Digital Art',
  description = 'Explore a vibrant digital art gallery featuring paintings, sculptures, digital art, and more from talented artists worldwide.',
  image = '/images/og-image.jpg',
  url,
  type = 'website'
}: SEOHeadProps) {
  const fullUrl = url ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://artverse.vercel.app'}${url}` : process.env.NEXT_PUBLIC_APP_URL || 'https://artverse.vercel.app'

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}