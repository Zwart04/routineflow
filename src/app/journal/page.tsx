'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import { BookOpen, Plus, Trash2, Clock, TrendingUp, Download, FileText, AlertCircle } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

function JournalContent() {
  const user = useStore((s) => s.user)
  const journal = useStore((s) => s.journal)
  const addJournalEntry = useStore((s) => s.addJournalEntry)
  const removeJournalEntry = useStore((s) => s.removeJournalEntry)
  const t = dict[useStore.getState().lang]
  const [mounted, setMounted] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), timeSpent: 30, outcome: '', productivityRate: 5 })
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const openAdd = () => {
    setForm({ date: new Date().toISOString().slice(0, 10), timeSpent: 30, outcome: '', productivityRate: 5 })
    setShowAdd(true)
  }

  const handleSave = () => {
    if (form.timeSpent <= 0) { toast.error('Waktu harus lebih dari 0'); return }
    if (form.productivityRate < 1 || form.productivityRate > 10) { toast.error('Rating 1-10 saja'); return }
    addJournalEntry(form.date, form.timeSpent, form.outcome.trim(), form.productivityRate)
    toast.success(t.common.save)
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    if (confirm(t.journal.confirmDelete)) {
      removeJournalEntry(id)
      toast.success(t.common.delete + ' ' + t.common.save)
    }
  }

  const exportPDF = async () => {
    setExporting('pdf')
    try {
      const doc = new jsPDF()
      doc.setFontSize(20)
      doc.text(t.journal.title, 20, 20)
      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28)
      doc.text(`User: ${user?.name}`, 20, 34)
      doc.setFontSize(14)
      doc.text(t.journal.entries, 20, 48)

      let y = 56
      journal.forEach((entry) => {
        if (y > 270) { doc.addPage(); y = 20 }
        doc.setFontSize(10)
        doc.text(`${entry.date} — ${entry.timeSpent} min`, 20, y)
        y += 6
        doc.setFontSize(9)
        doc.text(`Rating: ${entry.productivityRate}/10`, 20, y)
        y += 6
        doc.text(entry.outcome, 20, y)
        y += 10
      })

      doc.setFontSize(10)
      const totalTime = journal.reduce((a, e) => a + e.timeSpent, 0)
      const avgRating = journal.length > 0 ? (journal.reduce((a, e) => a + e.productivityRate, 0) / journal.length).toFixed(1) : '0'
      doc.text(`${t.journal.totalTime}: ${totalTime} ${t.common.minutes}`, 20, y + 10)
      doc.text(`${t.journal.productivityRate}: ${avgRating}/10`, 20, y + 16)

      doc.save('routineflow-journal.pdf')
      toast.success('PDF exported')
    } catch (e) {
      toast.error('Export failed')
    }
    setExporting(null)
  }

  const exportExcel = () => {
    setExporting('excel')
    try {
      const wsData = journal.map(e => ({
        Date: e.date,
        'Time Spent (min)': e.timeSpent,
        'Productivity Rate (1-10)': e.productivityRate,
        Outcome: e.outcome,
      }))
      const ws = XLSX.utils.json_to_sheet(wsData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Journal')
      XLSX.writeFile(wb, 'routineflow-journal.xlsx')
      toast.success('Excel exported')
    } catch (e) {
      toast.error('Export failed')
    }
    setExporting(null)
  }

  const totalTime = journal.reduce((a, e) => a + e.timeSpent, 0)
  const avgRating = journal.length > 0 ? (journal.reduce((a, e) => a + e.productivityRate, 0) / journal.length).toFixed(1) : '0'

  return (
    <>
      <Toaster />
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t.journal.title}</h1>
            <p className="text-muted-foreground">{t.journal.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportPDF}
              disabled={journal.length === 0 || exporting === 'pdf'}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              {exporting === 'pdf' ? <AlertCircle className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {t.journal.exportPdf}
            </button>
            <button
              onClick={exportExcel}
              disabled={journal.length === 0 || exporting === 'excel'}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              {exporting === 'excel' ? <AlertCircle className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {t.journal.exportExcel}
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> {t.journal.addEntry}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">{t.journal.totalTime}</p>
            <p className="text-2xl font-bold">{totalTime}</p>
            <p className="text-sm text-muted-foreground">{t.common.minutes}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">{t.journal.productivityRate}</p>
            <p className="text-2xl font-bold">{avgRating}</p>
            <p className="text-sm text-muted-foreground">/10 avg</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">{t.analytics.totalSessions}</p>
            <p className="text-2xl font-bold">{journal.length}</p>
            <p className="text-sm text-muted-foreground">entries</p>
          </div>
        </div>

        {showAdd && (
          <div className="mb-6 bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold">{t.journal.addEntry}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.journal.date}</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.journal.timeSpent}</label>
                <input
                  type="number"
                  min="1"
                  value={form.timeSpent}
                  onChange={(e) => setForm({ ...form, timeSpent: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.journal.outcome}</label>
              <textarea
                value={form.outcome}
                onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none h-24"
                placeholder="What did you accomplish? Any notes?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.journal.productivityRate} (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={form.productivityRate}
                onChange={(e) => setForm({ ...form, productivityRate: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>1 (low)</span>
                <span className="font-medium text-foreground">{form.productivityRate}</span>
                <span>10 (high)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-border font-medium hover:bg-muted transition-colors">
                {t.common.cancel}
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                {t.common.save}
              </button>
            </div>
          </div>
        )}

        {journal.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">{t.journal.noEntries}</p>
            <button onClick={openAdd} className="text-primary font-medium hover:underline mt-2">
              {t.journal.addEntry} &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {journal.sort((a, b) => b.date.localeCompare(a.date)).map((entry) => (
              <div key={entry.id} className="p-4 bg-card rounded-xl border border-border hover:bg-muted/30 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">{entry.date}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted">{entry.timeSpent} min</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">{entry.productivityRate}/10</span>
                    </div>
                    <p className="text-sm">{entry.outcome || '—'}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function JournalPage() {
  return (
    <AuthGuard>
      <JournalContent />
    </AuthGuard>
  )
}
