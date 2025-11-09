import type { Metadata } from 'next'
import '@/styles/globals.css'
import '@/index.css'

export const metadata: Metadata = {
  title: 'KindDrop',
  description: 'Spread kindness with thoughtful messages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
