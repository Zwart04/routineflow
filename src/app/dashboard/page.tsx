'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import {
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  CalendarDays,
  ListChecks,
  ArrowRight,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function DashboardContent() {
  const user = useStore((s) => s.user)
  const routines = useStore((s) => s.routines)
  const habits = useStore((s) => s.habits)
  const checkIns = useStore((s) => s.checkIns)
  const t = dict[useStore.getState().lang]
  const router = useRouter()
  const [streak, setStreak] = useState(0)
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([])
  const [progressPie, setProgressPie] = useState<{ name: string; value: number }[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Compute streak
    const today = new Date().toISOString().slice(0, 10)
    const sorted = [...checkIns].sort((a, b) => b.date.localeCompare(a.date))
    let count = 0
    let cursor = new Date(today)
    for (let i = 0; i < 365; i++) {
      const ds = cursor.toISOString().slice(0, 10)
      const dayCheckins = sorted.filter(c => c.date === ds && c.completed)
      if (dayCheckins.length > 0) {
        count++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    setStreak(count)

    // Heatmap: last 12 weeks
    const hm: { date: string; count: number }[] = []
    for (let w = 11; w >= 0; w--) {
      for (let d = 0; d < 7; d++) {
        const dt = new Date(today)
        dt.setDate(dt.getDate() - (w * 7 + (6 - d)))
        const ds = dt.toISOString().slice(0, 10)
        const count = sorted.filter(c => c.date === ds && c.completed).length
        hm.push({ date: ds, count })
      }
    }
    setHeatmapData(hm)

    // Progress pie: completed vs pending today
    const todayCheckins = checkIns.filter(c => c.date === today)
    const done = todayCheckins.filter(c => c.completed).length
    const total = todayCheckins.length || habits.length
    setProgressPie([
      { name: t.dash.completed, value: done },
      { name: t.dash.pending, value: Math.max(0, total - done) },
    ])
  }, [checkIns, habits, t])

  if (!mounted) return null

  const today = new Date().toISOString().slice(0, 10)
  const todayCompleted = checkIns.filter(c => c.date === today && c.completed).length
  const todayTotal = checkIns.filter(c => c.date === today).length || habits.length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">{t.dash.title}</h1>
          <p className="text-muted-foreground">{t.dash.welcome}, {user?.name}</p>
        </div>
        <Link
          href="/routines"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t.dash.viewAll} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Flame} label={t.dash.streak} value={`${streak} ${t.common.days}`} />
        <StatCard icon={CheckCircle2} label={t.dash.todayProgress} value={`${todayCompleted}/${todayTotal}`} />
        <StatCard icon={ListChecks} label={t.dash.routines} value={routines.length} />
        <StatCard icon={TrendingUp} label="Completion" value={todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) + '%' : '0%'} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Progress pie */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">{t.dash.todayProgress}</h3>
          {progressPie[0]?.value > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={progressPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {progressPie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
              {t.common.noData}
            </div>
          )}
          <div className="flex justify-center gap-4 mt-4 text-sm">
            {progressPie.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">{t.heatmap.title}</h3>
          <div className="flex items-end gap-0.5 h-32">
            {heatmapData.map((d, i) => {
              const intensity = Math.min(1, d.count / 5)
              const color = d.count === 0
                ? 'hsl(214.3 31.8% 91.4%)'
                : d.count <= 2
                  ? 'hsl(221.2 83.2% 53.3% / 0.3)'
                  : d.count <= 4
                    ? 'hsl(221.2 83.2% 53.3% / 0.6)'
                    : 'hsl(221.2 83.2% 53.3%)'
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ backgroundColor: color, height: `${Math.max(4, intensity * 100)}%` }}
                  title={`${d.date}: ${d.count} habit${d.count !== 1 ? 's' : ''}`}
                />
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-hsl-214-31-91-4" />Low</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(221.2 83.2% 53.3% / 0.3)' }} />Moderate</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(221.2 83.2% 53.3%)' }} />High</div>
          </div>
        </div>
      </div>

      {/* Routine cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routines.slice(0, 6).map((r) => (
          <RoutineCard key={r.id} routine={r} t={t} />
        ))}
        {routines.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <ListChecks className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">{t.routines.noRoutines}</p>
            <button
              onClick={() => router.push('/routines')}
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              {t.routines.add} &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function RoutineCard({ routine, t }: { routine: any, t: any }) {
  const habits = useStore.getState().habits
  const routineHabits = (routine.habits as string[]).map((id: string) => habits.find((h: any) => h.id === id)).filter(Boolean)
  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
      <h3 className="font-semibold mb-1">{routine.name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{routine.description}</p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="w-4 h-4" />
        <span>{routineHabits.length} {t.dash.habits}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          {t.dash.viewAll}
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
