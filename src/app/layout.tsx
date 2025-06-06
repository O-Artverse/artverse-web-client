import type { Metadata } from 'next'
import './globals.css'
import { Be_Vietnam_Pro } from 'next/font/google'
import AppProvider from './provider'

export const metadata: Metadata = {
  title: 'artverse',
  // icons: '/icons/logo.png',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
