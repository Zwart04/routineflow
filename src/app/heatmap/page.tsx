'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import { Grid3X3, Flame, CalendarDays, TrendingUp } from 'lucide-react'

function HeatmapContent() {
  const checkIns = useStore((s) => s.checkIns)
  const t = dict[useStore.getState().lang]
  const [mounted, setMounted] = useState(false)
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number; level: number }[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalDays, setTotalDays] = useState(0)

  useEffect(() => {
    setMounted(true)
    const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date))
    const today = new Date().toISOString().slice(0, 10)

    // Last 12 weeks (84 days)
    const data: { date: string; count: number; level: number }[] = []
    for (let w = 11; w >= 0; w--) {
      for (let d = 0; d < 7; d++) {
        const dt = new Date(today)
        dt.setDate(dt.getDate() - (w * 7 + (6 - d)))
        const ds = dt.toISOString().slice(0, 10)
        const count = sorted.filter(c => c.date === ds && c.completed).length
        const level = Math.min(1, count / 5)
        data.push({ date: ds, count, level })
      }
    }
    setHeatmapData(data)

    // Current streak
    let streak = 0
    let cursor = new Date(today)
    for (let i = 0; i < 365; i++) {
      const ds = cursor.toISOString().slice(0, 10)
      if (sorted.some(c => c.date === ds && c.completed)) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else break
    }
    setCurrentStreak(streak)

    // Longest streak
    let longest = 0, run = 0
    const dates = [...new Set(sorted.filter(c => c.completed).map(c => c.date))].sort()
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || (new Date(dates[i]).getTime() - new Date(dates[i-1]).getTime()) / 86400000 <= 2) {
        run++
        longest = Math.max(longest, run)
      } else run = 1
    }
    setLongestStreak(longest)

    setTotalDays(new Set(sorted.filter(c => c.completed).map(c => c.date)).size)
  }, [checkIns, t])

  if (!mounted) return null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{t.heatmap.title}</h1>
        <p className="text-muted-foreground">{t.heatmap.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={Flame} label={t.heatmap.currentStreak} value={currentStreak} valueUnit={t.common.days} />
        <StatCard icon={TrendingUp} label={t.heatmap.longestStreak} value={longestStreak} valueUnit={t.common.days} />
        <StatCard icon={CalendarDays} label={t.heatmap.totalDays} value={totalDays} valueUnit={t.common.days} />
      </div>

      {/* Heatmap grid */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-end gap-0.5 h-40">
          {heatmapData.map((d, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all hover:opacity-80"
              style={{
                backgroundColor: d.count === 0
                  ? 'hsl(214.3 31.8% 91.4%)'
                  : d.level <= 0.2
                    ? 'hsl(221.2 83.2% 53.3% / 0.25)'
                    : d.level <= 0.5
                      ? 'hsl(221.2 83.2% 53.3% / 0.5)'
                      : d.level <= 0.8
                        ? 'hsl(221.2 83.2% 53.3% / 0.75)'
                        : 'hsl(221.2 83.2% 53.3%)',
                height: `${Math.max(4, d.level * 100)}%`,
              }}
              title={`${d.date}: ${d.count} completed`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-hsl-214-31-91-4" />
            <span>Less</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(221.2 83.2% 53.3% / 0.3)' }} />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(221.2 83.2% 53.3% / 0.6)' }} />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(221.2 83.2% 53.3%)' }} />
            <span>High</span>
          </div>
        </div>

        {heatmapData.filter(d => d.count > 0).length === 0 && (
          <div className="mt-8 text-center py-8 text-muted-foreground">
            <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Complete some routines to see your heatmap.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, valueUnit }: { icon: any, label: string, value: number, valueUnit: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 text-center">
      <Icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export default function HeatmapPage() {
  return (
    <AuthGuard>
      <HeatmapContent />
    </AuthGuard>
  )
}
