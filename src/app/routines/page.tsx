'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import { Plus, Edit2, Trash2, CalendarDays, ArrowRight, Clock, GripVertical } from 'lucide-react'
import { toast, Toaster } from 'sonner'

function RoutinesContent() {
  const user = useStore((s) => s.user)
  const routines = useStore((s) => s.routines)
  const habits = useStore((s) => s.habits)
  const addRoutine = useStore((s) => s.addRoutine)
  const updateRoutine = useStore((s) => s.updateRoutine)
  const removeRoutine = useStore((s) => s.removeRoutine)
  const t = dict[useStore.getState().lang]
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', habitIds: [] as string[] })

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const openAdd = () => {
    setForm({ name: '', description: '', habitIds: [] })
    setEditingId(null)
    setShowAdd(true)
  }

  const openEdit = (r: any) => {
    setForm({ name: r.name, description: r.description, habitIds: [...r.habits] })
    setEditingId(r.id)
    setShowAdd(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) { toast.error(t.routines.name + ' ' + t.auth.nameRequired); return }
    if (editingId) {
      updateRoutine(editingId, { name: form.name.trim(), description: form.description.trim(), habits: form.habitIds })
      toast.success(t.routines.edit + ' ' + t.common.save)
    } else {
      addRoutine(form.name.trim(), form.description.trim(), form.habitIds, [])
      toast.success(t.routines.add + ' ' + t.common.save)
    }
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    if (confirm(t.routines.confirmDelete)) {
      removeRoutine(id)
      toast.success(t.common.delete + ' ' + t.common.save)
    }
  }

  const selectedHabits = form.habitIds.map(id => habits.find(h => h.id === id)).filter(Boolean)

  return (
    <>
      <Toaster />
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t.routines.title}</h1>
            <p className="text-muted-foreground">Kelola rutin harian Anda</p>
          </div>
          {routines.length > 0 && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> {t.routines.add}
            </button>
          )}
        </div>

        {showAdd && (
          <div className="mb-8 bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold">{editingId ? t.routines.edit : t.routines.add}</h3>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              placeholder={t.routines.name}
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none h-24"
              placeholder={t.routines.description}
            />
            <div>
              <label className="block text-sm font-medium mb-2">{t.routines.habits}</label>
              <div className="flex flex-wrap gap-2">
                {habits.map((h) => (
                  <label key={h.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors text-sm">
                    <input
                      type="checkbox"
                      checked={form.habitIds.includes(h.id)}
                      onChange={(e) => {
                        if (e.target.checked) setForm({ ...form, habitIds: [...form.habitIds, h.id] })
                        else setForm({ ...form, habitIds: form.habitIds.filter(id => id !== h.id) })
                      }}
                      className="accent-primary"
                    />
                    {h.name}
                  </label>
                ))}
                {habits.length === 0 && <span className="text-sm text-muted-foreground">{t.routines.noRoutines}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-border font-medium hover:bg-muted transition-colors">
                {t.common.cancel}
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                {editingId ? t.common.save : t.routines.add}
              </button>
            </div>
          </div>
        )}

        {routines.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-4">{t.routines.noRoutines}</p>
            <button onClick={openAdd} className="text-primary font-medium hover:underline">{t.routines.add} &rarr;</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routines.map((r) => {
              const rHabits = r.habits.map(id => habits.find(h => h.id === id)).filter(Boolean)
              return (
                <div key={r.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{r.name}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <CalendarDays className="w-4 h-4" />
                    <span>{rHabits.length} {t.routines.habits}</span>
                  </div>
                  {rHabits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {rHabits.map((h) => (
                        <span key={h!.id} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                          {h!.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default function RoutinesPage() {
  return (
    <AuthGuard>
      <RoutinesContent />
    </AuthGuard>
  )
}
