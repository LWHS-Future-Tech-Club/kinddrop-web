import type { Metadata } from 'next'
import '@/styles/globals.css'
import '@/index.css'
import { FloatingGlow } from '@/components/FloatingGlow'

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
      <body>
        <FloatingGlow />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  )
}
