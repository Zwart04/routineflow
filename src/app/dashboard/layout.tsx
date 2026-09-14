'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import {
  Building2, CheckCircle2, BarChart3, Calendar, Share2, Users, Settings,
  Bell, Sparkles, TrendingUp, LogOut, Moon, Sun, Menu, X, ListChecks,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, habits, routines, profiles, notifications, locale, setLocale, darkMode, toggleDarkMode, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to access the dashboard.</p>
          <Link href="/auth"><Button>Go to Login</Button></Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Building2, end: true },
    { href: '/dashboard/routines', label: 'Routines', icon: ListChecks },
    { href: '/dashboard/habits', label: 'Habits', icon: CheckCircle2 },
    { href: '/dashboard/ai-generator', label: 'AI Generator', icon: Sparkles },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/share', label: 'Share', icon: Share2 },
    { href: '/dashboard/profiles', label: 'Profiles', icon: Users },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Building2 className="text-primary-foreground" size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg">RoutineFlow</h1>
              </div>
            </div>
            <button className="lg:hidden p-2 rounded-md hover:bg-muted" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.end && pathname === '/dashboard');
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-md hover:bg-muted lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md hover:bg-muted" onClick={toggleDarkMode}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="relative">
                <button className="p-2 rounded-md hover:bg-muted">
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />}
                </button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { logout(); router.push('/auth'); }}>
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
