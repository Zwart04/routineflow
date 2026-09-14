'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import { Link2, TrendingUp, TrendingDown } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts'

function CorrelationsContent() {
  const habits = useStore((s) => s.habits)
  const checkIns = useStore((s) => s.checkIns)
  const t = dict[useStore.getState().lang]
  const [mounted, setMounted] = useState(false)
  const [correlations, setCorrelations] = useState<{ habitA: string; habitB: string; correlation: number }[]>([])
  const [scatterData, setScatterData] = useState<{ x: number; y: number; habit: string }[]>([])

  useEffect(() => {
    setMounted(true)
    if (habits.length < 2) {
      setCorrelations([])
      return
    }

    // Compute Pearson correlation between habit completion rates per day
    const compMatrix: Record<string, Record<string, number>> = {}
    habits.forEach(h => { compMatrix[h.id] = {} })

    const dates = [...new Set(checkIns.map(c => c.date))].sort()
    dates.forEach(date => {
      habits.forEach(h => {
        const ci = checkIns.find(c => c.date === date && c.habitId === h.id)
        compMatrix[h.id][date] = ci?.completed ? 1 : 0
      })
    })

    const pairs: { habitA: string; habitB: string; correlation: number }[] = []
    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const a = habits[i], b = habits[j]
        const valsA = dates.map(d => compMatrix[a.id][d] || 0)
        const valsB = dates.map(d => compMatrix[b.id][d] || 0)
        const corr = pearson(valsA, valsB)
        if (Math.abs(corr) > 0.1) {
          pairs.push({ habitA: a.name, habitB: b.name, correlation: corr })
        }
      }
    }

    pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
    setCorrelations(pairs.slice(0, 10))

    // Scatter data for top pair (habit A vs habit B per day)
    if (pairs.length > 0) {
      const top = pairs[0]
      const a = habits.find(h => h.name === top.habitA)
      const b = habits.find(h => h.name === top.habitB)
      if (a && b) {
        const sd: { x: number; y: number; habit: string }[] = []
        dates.forEach(date => {
          const va = compMatrix[a.id][date] || 0
          const vb = compMatrix[b.id][date] || 0
          if (va > 0 || vb > 0) {
            sd.push({ x: va, y: vb, habit: `${a.name} vs ${b.name}` })
          }
        })
        setScatterData(sd.slice(0, 50))
      }
    }
  }, [habits, checkIns, t])

  if (!mounted) return null

  const hasData = correlations.length > 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{t.correlations.title}</h1>
        <p className="text-muted-foreground">{t.correlations.description}</p>
      </div>

      {!hasData ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Link2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">{t.correlations.noCorrelations}</p>
          <p className="text-sm text-muted-foreground">Complete routines with at least 2 habits to discover correlations.</p>
        </div>
      ) : (
        <>
          {/* Correlation list */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">{t.correlations.correlationStrength}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {correlations.map((c, i) => {
                const abs = Math.abs(c.correlation)
                const strength = abs > 0.5 ? t.correlations.strongPositive : abs > 0.3 ? t.correlations.weak : t.correlations.weak
                const isPos = c.correlation > 0
                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{c.habitA}</p>
                      <p className="text-sm text-muted-foreground truncate">vs {c.habitB}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {isPos ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                      <span className={`font-mono font-bold ${isPos ? 'text-emerald-500' : 'text-red-500'}`}>
                        {c.correlation.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Scatter chart */}
          {scatterData.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">{t.correlations.habitA} vs {t.correlations.habitB}</h3>
              <p className="text-sm text-muted-foreground mb-4">Daily completion: 1 = completed, 0 = not completed</p>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3 31.8% 91.4%)" />
                  <XAxis type="number" dataKey="x" name={t.correlations.habitA} stroke="hsl(215.4 16.3% 46.9%)" />
                  <YAxis type="number" dataKey="y" name={t.correlations.habitB} stroke="hsl(215.4 16.3% 46.9%)" />
                  <ZAxis type="category" dataKey="habit" range={[40, 400]} />
                  <Tooltip />
                  <Scatter data={scatterData} fill="hsl(221.2 83.2% 53.3%)" shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function pearson(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  if (n < 2) return 0
  const mx = x.reduce((a, b) => a + b, 0) / n
  const my = y.reduce((a, b) => a + b, 0) / n
  let num = 0, dx = 0, dy = 0
  for (let i = 0; i < n; i++) {
    const xi = x[i] - mx
    const yi = y[i] - my
    num += xi * yi
    dx += xi * xi
    dy += yi * yi
  }
  if (dx === 0 || dy === 0) return 0
  return num / Math.sqrt(dx * dy)
}

export default function CorrelationsPage() {
  return (
    <AuthGuard>
      <CorrelationsContent />
    </AuthGuard>
  )
}
