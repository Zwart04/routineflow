'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import { BarChart3, TrendingUp, Clock, CheckCircle2, RefreshCw, Link2 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function AnalyticsContent() {
  const user = useStore((s) => s.user)
  const habits = useStore((s) => s.habits)
  const checkIns = useStore((s) => s.checkIns)
  const source = useStore((s) => s.source)
  const t = dict[useStore.getState().lang]
  const [mounted, setMounted] = useState(false)
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([])
  const [completionRate, setCompletionRate] = useState(0)
  const [avgDuration, setAvgDuration] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [sourceData, setSourceData] = useState<{ name: string; value: number }[]>([])
  const [streaks, setStreaks] = useState<{ label: string; value: number }[]>([])

  const computeStreak = (sorted: typeof checkIns, today: Date, startCount: number): number => {
    let count = startCount
    let cursor = new Date(today)
    for (let i = 0; i < 365; i++) {
      const ds = cursor.toISOString().slice(0, 10)
      if (sorted.some((c: any) => c.date === ds && c.completed)) {
        count++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return count
  }

  const computeLongestStreak = (sorted: typeof checkIns): number => {
    let longest = 0
    let current = 0
    const dates = [...new Set(sorted.filter((c: any) => c.completed).map((c: any) => c.date))].sort()
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        current = 1
      } else {
        const prev = new Date(dates[i - 1] as string)
        const curr = new Date(dates[i] as string)
        const diff = (curr.getTime() - prev.getTime()) / 86400000
        if (diff === 1) {
          current++
        } else {
          current = 1
        }
      }
      longest = Math.max(longest, current)
    }
    return longest
  }

  useEffect(() => {
    setMounted(true)
    const today = new Date().toISOString().slice(0, 10)
    const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date))

    // Weekly trend (last 7 days)
    const wData: { day: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(today)
      dt.setDate(dt.getDate() - i)
      const ds = dt.toISOString().slice(0, 10)
      const count = sorted.filter(c => c.date === ds && c.completed).length
      wData.push({ day: dt.toLocaleDateString('en', { weekday: 'short' }), count })
    }
    setWeeklyData(wData)

    // Completion rate (last 7 days)
    const weekCheckins = sorted.filter(c => {
      const d = new Date(c.date)
      const diff = (new Date(today).getTime() - d.getTime()) / 86400000
      return diff >= 0 && diff <= 7
    })
    const done = weekCheckins.filter(c => c.completed).length
    setCompletionRate(weekCheckins.length > 0 ? Math.round((done / weekCheckins.length) * 100) : 0)

    // Avg duration
    const durations = weekCheckins.filter(c => c.completed && c.duration).map(c => c.duration!)
    setAvgDuration(durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0)

    // Total sessions
    setTotalSessions(sorted.filter(c => c.completed).length)

    // Streaks
    const currentStreak = computeStreak(sorted, new Date(today), 0)
    const longestStreak = computeLongestStreak(sorted)
    setStreaks([
      { label: 'Current', value: currentStreak },
      { label: 'Longest', value: longestStreak },
    ])

    // Source attribution
    const sourceCounts: Record<string, number> = { Direct: 0, Social: 0, Search: 0, Referral: 0 }
    // Show mock attribution — in real app this would be from multiple users
    const current = source || 'direct'
    sourceCounts[current.charAt(0).toUpperCase() + current.slice(1)] = 1
    setSourceData(Object.entries(sourceCounts).map(([name, value]) => ({ name, value })))
  }, [checkIns, source, t])

  if (!mounted) return null

  const hasData = checkIns.length > 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{t.analytics.title}</h1>
        <p className="text-muted-foreground">{t.analytics.streakStats}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label={t.analytics.weeklyTrend} iconColor="text-emerald-500">
          <span className="text-2xl font-bold">{weeklyData[weeklyData.length - 1]?.count || 0}</span>
          <span className="text-sm text-muted-foreground">{t.common.thisWeek.toLowerCase()}</span>
        </StatCard>
        <StatCard icon={CheckCircle2} label={t.analytics.completionRate} iconColor="text-blue-500">
          <span className="text-2xl font-bold">{completionRate}%</span>
          <span className="text-sm text-muted-foreground">7 days</span>
        </StatCard>
        <StatCard icon={Clock} label={t.analytics.avgDuration} iconColor="text-amber-500">
          <span className="text-2xl font-bold">{avgDuration}</span>
          <span className="text-sm text-muted-foreground">{t.common.minutes}</span>
        </StatCard>
        <StatCard icon={BarChart3} label={t.analytics.totalSessions} iconColor="text-purple-500">
          <span className="text-2xl font-bold">{totalSessions}</span>
          <span className="text-sm text-muted-foreground">total</span>
        </StatCard>
      </div>

      {/* Streaks */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {streaks.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{s.label === 'Current' ? t.heatmap.currentStreak : t.heatmap.longestStreak}</p>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{t.common.days}</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${s.label === 'Current' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
              <FlameIcon className={`w-8 h-8 ${s.label === 'Current' ? 'text-emerald-500' : 'text-blue-500'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">{t.analytics.weeklyTrend}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3 31.8% 91.4%)" />
              <XAxis dataKey="day" stroke="hsl(215.4 16.3% 46.9%)" />
              <YAxis stroke="hsl(215.4 16.3% 46.9%)" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">{t.analytics.sourceAttribution}</h3>
          {sourceData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                {sourceData.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              <Link2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>{utmHelp(t)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Attribution help */}
      {!hasData && (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-border">
          <p className="mb-1">{t.analytics.noData}</p>
          <p className="text-sm">Share {t.appName} via <code className="px-1.5 py-0.5 rounded bg-muted text-xs">?utm_source=twitter</code> or <code className="px-1.5 py-0.5 rounded bg-muted text-xs">?ref=friend</code> to track traffic sources.</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, children, iconColor }: { icon: any, label: string, children: React.ReactNode, iconColor: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {label}
      </div>
      {children}
    </div>
  )
}

function FlameIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .459-2.364 3.221-4.086 5-4.086h.328c1.779 0 3 1.221 3.447 3.004A3.5 3.5 0 0 1 17 5c0 .442-.008.925-.152 1.452C16.123 7.566 14.533 9.5 12 11c-2.334 1.366-4.577 2.543-6.623 3.368A3.5 3.5 0 0 1 1 12a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function utmHelp(t: any) {
  return 'Buka dengan ?utm_source=twitter untuk melacak sumber traffic.'
}

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <AnalyticsContent />
    </AuthGuard>
  )
}
