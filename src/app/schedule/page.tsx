'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import { Sparkles, Clock, Sun, Moon, Zap, RefreshCw, Plus, Trash2, Play, Pause } from 'lucide-react'
import { toast, Toaster } from 'sonner'

type EnergyLevel = 'low' | 'medium' | 'high'
type Chronotype = 'early' | 'neutral' | 'late'

function ScheduleContent() {
  const routines = useStore((s) => s.routines)
  const habits = useStore((s) => s.habits)
  const schedule = useStore((s) => s.schedule)
  const setSchedule = useStore((s) => s.setSchedule)
  const clearSchedule = useStore((s) => s.clearSchedule)
  const addCheckIn = useStore((s) => s.addCheckIn)
  const t = dict[useStore.getState().lang]
  const [mounted, setMounted] = useState(false)
  const [energy, setEnergy] = useState<EnergyLevel>('medium')
  const [chronotype, setChronotype] = useState<Chronotype>('neutral')
  const [generating, setGenerating] = useState(false)
  const [now, setNow] = useState(new Date())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [timers, setTimers] = useState<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    setMounted(true)
    const iv = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    return () => Object.values(timers).forEach(clearTimeout)
  }, [timers])

  if (!mounted) return null

  const energyWeights: Record<EnergyLevel, number> = { low: 0.6, medium: 1.0, high: 1.4 }
  const chronotypeOffset: Record<Chronotype, number> = { early: -1, neutral: 0, late: 1 }

  const generateSchedule = () => {
    setGenerating(true)
    setTimeout(() => {
      const blocks: any[] = []
      const dayStart = 6 + chronotypeOffset[chronotype]
      const dayEnd = 22 + chronotypeOffset[chronotype]
      const weight = energyWeights[energy]
      let cursor = dayStart

      // Morning routine 6:00-8:00
      const morningBlock = [
        { label: t.schedule.morning + ' 1', start: `${String(dayStart).padStart(2, '0')}:00`, end: `${String(dayStart).padStart(2, '0')}:30`, duration: 30, habitId: habits[0]?.id || undefined },
        { label: t.schedule.morning + ' 2', start: `${String(dayStart).padStart(2, '0')}:30`, end: `${String(dayStart).padStart(2, '0')}:50`, duration: 20, habitId: habits[1]?.id || undefined },
      ].filter(Boolean)

      morningBlock.forEach((b) => {
        blocks.push({ ...b, id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 7) })
      })

      cursor = dayStart + 2.5

      // Build time blocks for habits
      const activeHabits = habits.filter(() => true)
      activeHabits.forEach((h, idx) => {
        const duration = Math.round((15 + (idx % 3) * 10) * weight)
        const startH = Math.floor(cursor)
        const startM = Math.round((cursor - startH) * 60)
        const endH = Math.floor(cursor + duration / 60)
        const endM = Math.round((duration / 60 - Math.floor(duration / 60)) * 60 + startM)
        if (endH <= dayEnd) {
          blocks.push({
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            label: `${h.name} (${duration} min)`,
            start: `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
            end: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`,
            habitId: h.id,
            duration,
          })
          cursor += duration / 60 + 0.25 // 15 min break
        }
      })

      // Evening wind-down
      const eveningStart = Math.min(dayEnd - 2, 20)
      blocks.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        label: t.schedule.evening,
        start: `${String(eveningStart).padStart(2, '0')}:00`,
        end: `${String(eveningStart + 1).padStart(2, '0')}:00`,
        duration: 60,
      })

      setSchedule(blocks)
      toast.success(t.schedule.personalized)
      setGenerating(false)
    }, 600)
  }

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const startTimer = (blockId: string, duration: number) => {
    setActiveId(blockId)
    const iv = setTimeout(() => {
      setActiveId(null)
      setTimers(prev => { const t = { ...prev }; delete t[blockId]; return t })
      toast.success('Selesai — ' + t.common.save)
    }, duration * 60 * 1000)
    setTimers(prev => ({ ...prev, [blockId]: iv }))
  }

  const nowMin = timeToMinutes(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)

  return (
    <>
      <Toaster />
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t.schedule.title}</h1>
            <p className="text-muted-foreground">{t.schedule.description}</p>
          </div>
          <button
            onClick={generateSchedule}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? t.common.loading : t.schedule.generate}
          </button>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 p-5 bg-card rounded-xl border border-border">
          <div>
            <label className="block text-sm font-medium mb-2">{t.schedule.energy}</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as EnergyLevel[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setEnergy(e)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    energy === e ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t.schedule.chronotype}</label>
            <div className="flex gap-2">
              {(['early', 'neutral', 'late'] as Chronotype[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setChronotype(c)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    chronotype === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} WIB</span>
          </div>
        </div>

        {/* Schedule timeline */}
        {schedule.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">{t.schedule.noSchedule}</p>
            <p className="text-sm text-muted-foreground">Pilih tingkat energi dan tipe kronotipe, lalu klik {t.schedule.generate}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.map((block) => {
              const startMin = timeToMinutes(block.start)
              const endMin = timeToMinutes(block.end)
              const isNow = nowMin >= startMin && nowMin < endMin
              const isActive = activeId === block.id
              const remaining = isActive
                ? Math.max(0, (parseInt(block.end.split(':')[0]) * 60 + parseInt(block.end.split(':')[1])) - (now.getHours() * 60 + now.getMinutes()))
                : 0

              return (
                <div
                  key={block.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : isNow
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border bg-card hover:bg-muted/30'
                  }`}
                >
                  <div className={`w-1.5 h-12 rounded-full shrink-0 ${isActive ? 'bg-primary' : isNow ? 'bg-primary/60' : 'bg-muted'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{block.label}</span>
                      {isActive && <span className="px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">Running</span>}
                      {isNow && !isActive && <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">Now</span>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{block.start} - {block.end}</span>
                      <span>{block.duration} min</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isActive && !isNow && (
                      <button
                        onClick={() => startTimer(block.id, block.duration)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Start timer"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {isActive && (
                      <div className="text-right">
                        <div className="text-lg font-mono font-bold text-primary">{Math.ceil(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
                        <button
                          onClick={() => { clearTimeout(timers[block.id]); setActiveId(null); setTimers(prev => { const t = { ...prev }; delete t[block.id]; return t }) }}
                          className="text-xs text-muted-foreground hover:text-destructive mt-1"
                        >
                          Skip
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default function SchedulePage() {
  return (
    <AuthGuard>
      <ScheduleContent />
    </AuthGuard>
  )
}
