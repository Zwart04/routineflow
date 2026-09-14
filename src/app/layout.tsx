import type { Metadata } from 'next'
import './globals.css'
import { AppWrapper } from '@/components/AppWrapper'

export const metadata: Metadata = {
  title: 'RoutineFlow — AI-Powered Daily Routine Orchestrator',
  description: 'Build better habits with AI-powered scheduling, real-time tracking, and calendar sync.',
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  )
}
