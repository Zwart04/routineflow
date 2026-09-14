// ─── Utils ───
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getToday(): string {
  return formatDate(new Date())
}

export function getDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return formatDate(d)
}

export function calculateStreak(checkIns: { date: string; completed: boolean }[]): number {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = formatDate(d)
    const found = checkIns.find(c => c.date === dateStr)
    if (found?.completed) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export function calculateCompletionRate(checkIns: { completed: boolean }[]): number {
  if (checkIns.length === 0) return 0
  return Math.round((checkIns.filter(c => c.completed).length / checkIns.length) * 100)
}

export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length
  if (n === 0) return 0
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0)
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0)
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0)
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  return denominator === 0 ? 0 : numerator / denominator
}

export function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}