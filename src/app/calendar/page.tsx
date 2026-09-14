'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import { Calendar, Download, ExternalLink, CheckCircle2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'

function CalendarContent() {
  const router = useRouter()
  const routines = useStore((s) => s.routines)
  const habits = useStore((s) => s.habits)
  const t = dict[useStore.getState().lang]
  const [mounted, setMounted] = useState(false)
  const [exported, setExported] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const generateICS = () => {
    if (routines.length === 0) {
      toast.warning(t.calendar.noRoutines)
      return
    }

    const today = new Date()
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//RoutineFlow//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:RoutineFlow Routines',
    ]

    routines.forEach((r, ri) => {
      r.schedule.forEach((block, bi) => {
        const [sh, sm] = block.start.split(':').map(Number)
        const [eh, em] = block.end.split(':').map(Number)
        const start = new Date(today)
        start.setHours(sh, sm, 0, 0)
        const end = new Date(today)
        end.setHours(eh, em, 0, 0)

        const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

        lines.push('BEGIN:VEVENT')
        lines.push(`UID:routineflow-${r.id}-${ri}-${bi}@routineflow.app`)
        lines.push(`DTSTAMP:${fmt(new Date())}`)
        lines.push(`DTSTART:${fmt(start)}`)
        lines.push(`DTEND:${fmt(end)}`)
        lines.push(`SUMMARY:${r.name} — ${block.label}`)
        lines.push(`DESCRIPTION:${r.description}`)
        if (block.habitId) {
          const habit = habits.find(h => h.id === block.habitId)
          if (habit) lines.push(`CATEGORIES:${habit.name}`)
        }
        lines.push('END:VEVENT')
      })
    })

    lines.push('END:VCALENDAR')
    const ics = lines.join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `routineflow-routines.ics`
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    toast.success(t.calendar.exported)
    setTimeout(() => setExported(false), 3000)
  }

  if (!mounted) return null

  return (
    <>
      <Toaster />
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{t.calendar.title}</h1>
          <p className="text-muted-foreground">{t.calendar.description}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={generateICS}
              disabled={routines.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {t.calendar.exportIcs}
            </button>
            {exported && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-500">
                <CheckCircle2 className="w-4 h-4" /> {t.calendar.exported}
              </span>
            )}
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=RoutineFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm"
            >
              <ExternalLink className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">{t.calendar.googleCalendar}</p>
                <p className="text-xs text-muted-foreground">Opens in new tab</p>
              </div>
            </a>
            <a
              href="https://calendar.apple.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm"
            >
              <ExternalLink className="w-5 h-5 text-silver-500" />
              <div>
                <p className="font-medium">{t.calendar.appleCalendar}</p>
                <p className="text-xs text-muted-foreground">Opens in new tab</p>
              </div>
            </a>
            <a
              href="https://outlook.live.com/calendar/0/deeplink/compose"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm"
            >
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{t.calendar.outlook}</p>
                <p className="text-xs text-muted-foreground">Opens in new tab</p>
              </div>
            </a>
          </div>
        </div>

        {routines.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">{t.calendar.noRoutines}</p>
            <button onClick={() => router.push('/routines')} className="text-primary font-medium hover:underline">
              {t.routines.add} &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {routines.map((r) => (
              <div key={r.id} className="p-4 bg-card rounded-xl border border-border">
                <h3 className="font-semibold mb-2">{r.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
                {r.schedule.map((block) => (
                  <div key={block.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-border last:border-0">
                    <span className="font-mono text-muted-foreground w-16 shrink-0">{block.start} - {block.end}</span>
                    <span className="truncate">{block.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function CalendarPage() {
  return (
    <AuthGuard>
      <CalendarContent />
    </AuthGuard>
  )
}
