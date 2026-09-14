'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { dict } from '@/lib/i18n'
import { generateId } from '@/lib/utils'

export default function LoginForm() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  const user = useStore.getState().user
  const login = useStore.getState().login
  const register = useStore.getState().register
  const lang = useStore.getState().lang
  const setLang = useStore.getState().setLang
  const t = dict[lang]

  if (!mounted) {
    setTimeout(() => {}, 0)
    setMounted(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError(t.auth.emailRequired)
      return
    }

    if (isRegister) {
      const ok = useStore.getState().register(name || email.split('@')[0], email, password)
      if (ok) {
        router.push('/dashboard')
      } else {
        setError(t.auth.emailTaken)
      }
    } else {
      const ok = useStore.getState().login(email, password)
      if (ok) {
        router.push('/dashboard')
      } else {
        setError(t.auth.invalidCredentials)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-xl border border-border">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">RF</span>
          </div>
          <h1 className="text-2xl font-bold">{isRegister ? t.auth.register : t.auth.login}</h1>
          <p className="text-muted-foreground mt-2">{t.appTagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.auth.name}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">{t.auth.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t.auth.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            {isRegister ? t.auth.register : t.auth.login}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={router.back}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            {t.auth.hasAccount}
          </button>
        </div>
      </div>
    </div>
  )
}