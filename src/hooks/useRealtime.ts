'use client'

import { useState, useEffect, useRef } from 'react'
import type { CheckIn } from '@/lib/store'
import { useStore } from '@/lib/store'

export function useBroadcast() {
  const channelRef = useRef<BroadcastChannel | null>(null)
  const checkIns = useStore((s) => s.checkIns)
  const addCheckIn = useStore((s) => s.addCheckIn)

  useEffect(() => {
    channelRef.current = new BroadcastChannel('routineflow-channel')
    channelRef.current.onmessage = (event) => {
      if (event.data?.type === 'checkin') {
        const data = event.data.payload as CheckIn
        addCheckIn(data.date, data.habitId, data.completed, data.duration)
      }
    }
    return () => {
      channelRef.current?.close()
    }
  }, [addCheckIn])

  const broadcastCheckIn = (checkIn: CheckIn) => {
    addCheckIn(checkIn.date, checkIn.habitId, checkIn.completed, checkIn.duration)
    channelRef.current?.postMessage({ type: 'checkin', payload: checkIn })
  }

  return { checkIns, broadcastCheckIn }
}

export function useUTMAttribution() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const utmSource = params.get('utm_source') || params.get('source') || ''
    if (utmSource && !localStorage.getItem('rf_source')) {
      localStorage.setItem('rf_source', utmSource)
    }
  }, [])

  if (!mounted) return { source: null }
  return { source: localStorage.getItem('rf_source') }
}