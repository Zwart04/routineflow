'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '../lib/store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const [mounted, setMounted] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setMounted(true)
    setChecked(true)
  }, [])

  if (!mounted || !checked) return null

  if (!user) {
    router.push('/login')
    return null
  }

  return <>{children}</>
}