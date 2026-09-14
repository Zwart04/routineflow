'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { NavBar } from '@/components/NavBar'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const theme = useStore((s) => s.theme)
  const lang = useStore((s) => s.lang)
  const applyTheme = useStore((s) => s.applyTheme)
  const resolvedTheme = useStore((s) => s.resolvedTheme)

  useEffect(() => {
    setMounted(true)
    // Resolve theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme
    applyTheme(resolved)
    // Read URL attribution
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rf_source')
      if (!stored) {
        const params = new URLSearchParams(window.location.search)
        let source: 'direct' | 'social' | 'search' | 'referral' = 'direct'
        const utmSource = params.get('utm_source')?.toLowerCase()
        const utmMedium = params.get('utm_medium')?.toLowerCase()
        if (utmSource === 'twitter' || utmSource === 'x' || utmSource === 'instagram' || utmMedium === 'social') {
          source = 'social'
        } else if (utmSource === 'google' || utmSource === 'bing' || utmMedium === 'cpc' || utmMedium === 'organic') {
          source = 'search'
        } else if (utmSource === 'newsletter' || params.get('ref')) {
          source = 'referral'
        }
        localStorage.setItem('rf_source', source)
      }
    }
    setReady(true)
  }, [theme, applyTheme])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">{dict[lang].common.loading}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
