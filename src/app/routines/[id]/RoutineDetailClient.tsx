'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import { toast, Toaster } from 'sonner'

export default function RoutineDetailContent() {
  const params = useParams()
  const router = useRouter()
  const routines = useStore((s) => s.routines)
  const habits = useStore((s) => s.habits)
  const t = dict[useStore.getState().lang]
  const [mounted, setMounted] = useState(false)
  const [routine, setRoutine] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const id = params.id as string
    const r = routines.find(r => r.id === id)
    setRoutine(r || null)
  }, [params.id, routines])

  if (!mounted) return null
  if (!routine) {
    toast.error(t.errors.generic)
    router.push('/routines')
    return null
  }

  const routineHabits = (routine.habits as string[]).map((id: string) => habits.find((h: any) => h.id === id)).filter(Boolean)

  return (
    <>
      <Toaster />
      <div className="mb-6">
        <button onClick={() => router.push('/routines')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.common.cancel}
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{routine.name}</h1>
        <p className="text-muted-foreground mb-4">{routine.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            <span>{routineHabits.length} {t.routines.habits}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Created {new Date(routine.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {routineHabits.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{t.routines.noRoutines}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {routineHabits.map((h) => (
            <div key={h!.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium" style={{ backgroundColor: h!.color || '#3b82f6' }}>
                  {h!.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{h!.name}</p>
                  <p className="text-sm text-muted-foreground">{h!.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => router.push(`/schedule?routine=${routine.id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <CalendarDays className="w-4 h-4" /> {t.routines.schedule}
        </button>
      </div>
    </>
  )
}