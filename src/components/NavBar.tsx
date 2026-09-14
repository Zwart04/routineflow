'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import {
  LayoutDashboard,
  Calendar,
  ListChecks,
  BarChart3,
  Grid3X3,
  Link2,
  BookOpen,
  Settings,
  Sun,
  Moon,
  Globe,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'schedule', href: '/schedule', icon: Sparkles },
  { key: 'routines', href: '/routines', icon: ListChecks },
  { key: 'analytics', href: '/analytics', icon: BarChart3 },
  { key: 'heatmap', href: '/heatmap', icon: Grid3X3 },
  { key: 'correlations', href: '/correlations', icon: Link2 },
  { key: 'calendar', href: '/calendar', icon: Calendar },
  { key: 'journal', href: '/journal', icon: BookOpen },
  { key: 'settings', href: '/settings', icon: Settings },
]

export function NavBar() {
  const pathname = usePathname()
  const user = useStore((s) => s.user)
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const logout = useStore((s) => s.logout)
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = dict[lang]

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:block">{t.appName}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.nav[item.key as keyof typeof t.nav]}
                </Link>
              )
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={t.settings.language}
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={t.settings.theme}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User */}
            <div className="hidden sm:flex items-center gap-2 ml-2 border-l border-border pl-4">
              {user ? (
                <>
                  <span className="text-sm font-medium">{user.name}</span>
                  <button
                    onClick={() => logout()}
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title={t.auth.logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-primary hover:text-primary/80 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  {t.auth.login}
                </Link>
              )}
            </div>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden py-3 border-t border-border">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.nav[item.key as keyof typeof t.nav]}
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}
