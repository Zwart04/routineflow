import type { Metadata } from 'next';
import { AppProvider } from '@/lib/app-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'RoutineFlow — AI Daily Routine Orchestrator',
  description: 'AI-powered daily routine orchestrator with smart scheduling, real-time collaboration, and calendar sync.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
