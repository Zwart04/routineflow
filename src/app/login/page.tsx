'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const login = useStore((s) => s.login)
  const user = useStore((s) => s.user)
  const lang = useStore((s) => s.lang)
  const t = dict[lang]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError(t.auth.emailRequired); return }
    setLoading(true)
    // Simulate async
    await new Promise(r => setTimeout(r, 300))
    const ok = login(email.trim().toLowerCase(), password)
    setLoading(false)
    if (ok) {
      toast.success(t.common.loading.replace('...', 'logged in'))
      router.push('/dashboard')
    } else {
      setError(t.auth.invalidCredentials)
      toast.error(t.auth.invalidCredentials)
    }
  }

  if (user) router.push('/dashboard')

  return (
    <>
      <Toaster />
      <div className="min-h-[calc(100vh - 8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t.auth.login}</h1>
            <p className="text-muted-foreground">{t.auth.noAccount} <a href="/register" className="text-primary font-medium">{t.auth.register.toLowerCase()}</a></p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.auth.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">{t.auth.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t.auth.submit} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
