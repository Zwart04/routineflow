'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import {
  Sparkles,
  Calendar,
  ListChecks,
  BarChart3,
  Grid3X3,
  Link2,
  BookOpen,
  ArrowRight,
  Zap,
  Clock,
  MousePointerClick,
} from 'lucide-react'

const features = [
  { key: 'ai', title: 'AI Schedule Generator', desc: 'Smart scheduling generates optimal daily routines based on your goals, energy levels, and chronotype. Adapts to your productivity patterns.', icon: Sparkles },
  { key: 'realtime', title: 'Real-time Dashboard', desc: 'Cross-tab synchronization for live habit check-in. See your progress update instantly across all open tabs.', icon: MousePointerClick },
  { key: 'calendar', title: 'Calendar Sync (iCal)', desc: 'Export routines to .ics files compatible with Google Calendar, Apple Calendar, and Outlook. One-click download.', icon: Calendar },
  { key: 'analytics', title: 'Background Analytics', desc: 'Web Worker computes streaks, completion rates, and trend analysis off the main thread. No UI lag.', icon: BarChart3 },
  { key: 'timeblocking', title: 'Smart Time Blocking', desc: 'Interactive daily schedule with timer support. Built-in break reminders based on ultradian rhythm research.', icon: Clock },
  { key: 'correlation', title: 'Habit Correlation Engine', desc: 'Statistical analysis (Pearson correlation) discovers which habit combinations produce the best outcomes.', icon: Link2 },
  { key: 'heatmap', title: 'Progress Heatmap', desc: 'GitHub-style contribution heatmap showing daily routine completion intensity over 12 weeks.', icon: Grid3X3 },
  { key: 'journal', title: 'Productivity Journal', desc: 'Auto-journal tracks time invested vs outcomes. Export to PDF or Excel for review and reporting.', icon: BookOpen },
]

export default function LandingPage() {
  const router = useRouter()
  const lang = useStore((s) => s.lang)
  const t = dict[lang]
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {t.appName}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              {t.appTagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                {t.auth.register} <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3.5 rounded-xl border border-border font-medium hover:bg-muted transition-colors"
              >
                {t.auth.login}
              </button>
            </div>
          </div>
        </div>
        {/* Decorative dots pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything you need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From AI-powered scheduling to deep analytics — built for people who take their daily routines seriously.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.key} className="p-5 bg-card rounded-xl border border-border hover:shadow-md hover:border-primary/30 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to optimize your day?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands who have transformed their daily routines with intelligent scheduling.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            {t.auth.register} <ArrowRight className="inline w-4 h-4 ml-1" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t.appName}. Built with Next.js, Tailwind CSS, and Recharts.
        </div>
      </footer>
    </div>
  )
}
