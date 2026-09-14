'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { AuthGuard } from '@/components/AuthGuard'
import { Settings as SettingsIcon, Moon, Sun, Monitor, Globe, Mail, Link2, Trash2, Copy, Check, AlertTriangle, Loader2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'

function SettingsContent() {
  const user = useStore((s) => s.user)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const logout = useStore((s) => s.logout)
  const source = useStore((s) => s.source)
  const t = dict[useStore.getState().lang]
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const copyShareLink = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : ''
    navigator.clipboard.writeText(url + '/?ref=friend').then(() => {
      setCopied(true)
      toast.success(t.settings.linkCopied)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  const deleteAccount = () => {
    if (!confirm(t.settings.confirmDelete)) return
    setDeleting(true)
    setTimeout(() => {
      logout()
      toast.success('Account deleted')
      window.location.href = '/'
    }, 500)
  }

  return (
    <>
      <Toaster />
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{t.settings.title}</h1>
          <p className="text-muted-foreground">{t.settings.profile} & {t.settings.appearance}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" /> {t.settings.profile}
          </h2>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not signed in</p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5" /> {t.settings.appearance}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{t.settings.theme}</label>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    theme === t
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {t === 'light' ? <Sun className="w-4 h-4" /> : t === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.settings.language}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLang('en')}
                className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  lang === 'en' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <Globe className="w-4 h-4" /> English
              </button>
              <button
                onClick={() => setLang('id')}
                className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  lang === 'id' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <Globe className="w-4 h-4" /> Bahasa Indonesia
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5" /> {t.settings.shareLink}
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.origin + '/?ref=friend' : ''}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:outline-none"
            />
            <button
              onClick={copyShareLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : t.settings.copyLink}
            </button>
          </div>
          {source && (
            <p className="text-sm text-muted-foreground mt-3">Traffic source: <span className="font-medium text-foreground capitalize">{source}</span></p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" /> {t.settings.notifications}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Email notifications are simulated. No real email is sent.</p>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">{t.settings.emailNotifications}</span>
            <span className="text-sm text-muted-foreground">Mock mode (no email sent)</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-red-500/20 p-6">
          <h2 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" /> {t.settings.deleteAccount}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{t.settings.confirmDelete}</p>
          <button
            onClick={deleteAccount}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {deleting ? 'Deleting...' : t.settings.deleteAccount}
          </button>
        </div>
      </div>
    </>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
}
