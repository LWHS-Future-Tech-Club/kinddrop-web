import type { Metadata } from 'next'
import '@/styles/globals.css'
import '@/index.css'
import { FloatingGlow } from '@/app/components/FloatingGlow'

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
        <footer className="mx-6 mb-6 px-8 py-6">
          <div className="max-w-7xl mx-auto text-center">
            <span>© 2025 Future Tech Club</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
