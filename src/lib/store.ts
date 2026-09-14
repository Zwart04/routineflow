import { create } from 'zustand'
import { dict, Locale } from './i18n'

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type Habit = {
  id: string
  name: string
  category: string
  color: string
  createdAt: string
}

export type Routine = {
  id: string
  name: string
  description: string
  habits: string[]
  schedule: TimeBlock[]
  createdAt: string
}

export type TimeBlock = {
  id: string
  label: string
  start: string // HH:MM
  end: string
  habitId?: string
  duration: number // minutes
}

export type JournalEntry = {
  id: string
  date: string
  timeSpent: number // minutes
  outcome: string
  productivityRate: number // 1-10
  createdAt: string
}

export type CheckIn = {
  date: string
  habitId: string
  completed: boolean
  duration?: number
}

type Theme = 'light' | 'dark' | 'system'
type Source = 'direct' | 'social' | 'search' | 'referral'

interface Store {
  // Auth
  user: User | null
  users: User[]
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void

  // Theme
  theme: Theme
  setTheme: (t: Theme) => void
  resolvedTheme: 'light' | 'dark'
  applyTheme: (theme: 'light' | 'dark') => void

  // Language
  lang: Locale
  setLang: (l: Locale) => void

  // Habits
  habits: Habit[]
  addHabit: (name: string, category: string, color: string) => void
  removeHabit: (id: string) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void

  // Routines
  routines: Routine[]
  addRoutine: (name: string, description: string, habits: string[], schedule: TimeBlock[]) => void
  updateRoutine: (id: string, updates: Partial<Routine>) => void
  removeRoutine: (id: string) => void

  // Schedule / time blocks
  schedule: TimeBlock[]
  setSchedule: (blocks: TimeBlock[]) => void
  clearSchedule: () => void

  // Journal
  journal: JournalEntry[]
  addJournalEntry: (date: string, timeSpent: number, outcome: string, productivityRate: number) => void
  removeJournalEntry: (id: string) => void

  // Check-ins (for heatmap/streaks)
  checkIns: CheckIn[]
  addCheckIn: (date: string, habitId: string, completed: boolean, duration?: number) => void

  // Settings
  shareUrl: string
  setShareUrl: (url: string) => void

  // Attribution
  source: Source | null
  setSource: (s: Source) => void
}

const DEFAULT_USER: User = {
  id: 'default',
  name: 'Routines User',
  email: 'user@routineflow.app',
  createdAt: new Date().toISOString(),
}

function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return [DEFAULT_USER]
  try {
    const raw = localStorage.getItem('rf_users')
    if (raw) return JSON.parse(raw)
  } catch {}
  return [DEFAULT_USER]
}

function saveUsers(users: User[]) {
  try { localStorage.setItem('rf_users', JSON.stringify(users)) } catch {}
}

function getStoredUser(email: string): User | null {
  const users = getStoredUsers()
  return users.find(u => u.email === email) ?? null
}

export const useStore = create<Store>((set, get) => ({
  // Auth
  user: null,
  users: getStoredUsers(),
  login: (email, password) => {
    const user = getStoredUser(email)
    if (user && password.length >= 1) {
      set({ user })
      return true
    }
    return false
  },
  register: (name, email, password) => {
    const users = getStoredUsers()
    if (users.find(u => u.email === email)) return false
    if (password.length < 6) return false
    const newUser: User = {
      id: Date.now().toString(36),
      name,
      email,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsers(users)
    set({ user: newUser, users })
    return true
  },
  logout: () => set({ user: null }),

  // Theme
  theme: (typeof window !== 'undefined' ? (localStorage.getItem('rf_theme') as Theme) ?? 'system' : 'system'),
  setTheme: (t) => {
    set({ theme: t })
    try { localStorage.setItem('rf_theme', t) } catch {}
  },
  resolvedTheme: 'light',
  applyTheme: (theme) => {
    set({ resolvedTheme: theme })
    if (typeof document !== 'undefined') {
      if (theme === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  },

  // Language
  lang: (typeof window !== 'undefined' ? (localStorage.getItem('rf_lang') as Locale) ?? 'en' : 'en'),
  setLang: (l) => {
    set({ lang: l })
    try { localStorage.setItem('rf_lang', l) } catch {}
  },

  // Habits
  habits: [],
  addHabit: (name, category, color) => {
    const habits = get().habits
    habits.push({
      id: Date.now().toString(36),
      name,
      category,
      color,
      createdAt: new Date().toISOString(),
    })
    set({ habits })
    try { localStorage.setItem('rf_habits', JSON.stringify(habits)) } catch {}
  },
  removeHabit: (id) => {
    const habits = get().habits.filter(h => h.id !== id)
    set({ habits })
    try { localStorage.setItem('rf_habits', JSON.stringify(habits)) } catch {}
  },
  updateHabit: (id, updates) => {
    const habits = get().habits.map(h => h.id === id ? { ...h, ...updates } : h)
    set({ habits })
    try { localStorage.setItem('rf_habits', JSON.stringify(habits)) } catch {}
  },

  // Routines
  routines: [],
  addRoutine: (name, description, habits, schedule) => {
    const routines = get().routines
    routines.push({
      id: Date.now().toString(36),
      name,
      description,
      habits,
      schedule,
      createdAt: new Date().toISOString(),
    })
    set({ routines })
    try { localStorage.setItem('rf_routines', JSON.stringify(routines)) } catch {}
  },
  updateRoutine: (id, updates) => {
    const routines = get().routines.map(r => r.id === id ? { ...r, ...updates } : r)
    set({ routines })
    try { localStorage.setItem('rf_routines', JSON.stringify(routines)) } catch {}
  },
  removeRoutine: (id) => {
    const routines = get().routines.filter(r => r.id !== id)
    set({ routines })
    try { localStorage.setItem('rf_routines', JSON.stringify(routines)) } catch {}
  },

  // Schedule
  schedule: [],
  setSchedule: (blocks) => set({ schedule: blocks }),
  clearSchedule: () => set({ schedule: [] }),

  // Journal
  journal: [],
  addJournalEntry: (date, timeSpent, outcome, productivityRate) => {
    const journal = get().journal
    journal.push({
      id: Date.now().toString(36),
      date,
      timeSpent,
      outcome,
      productivityRate,
      createdAt: new Date().toISOString(),
    })
    set({ journal })
    try { localStorage.setItem('rf_journal', JSON.stringify(journal)) } catch {}
  },
  removeJournalEntry: (id) => {
    const journal = get().journal.filter(e => e.id !== id)
    set({ journal })
    try { localStorage.setItem('rf_journal', JSON.stringify(journal)) } catch {}
  },

  // Check-ins
  checkIns: [],
  addCheckIn: (date, habitId, completed, duration) => {
    const checkIns = get().checkIns
    // Upsert
    const existing = checkIns.findIndex(c => c.date === date && c.habitId === habitId)
    if (existing >= 0) {
      checkIns[existing] = { date, habitId, completed, duration }
    } else {
      checkIns.push({ date, habitId, completed, duration })
    }
    set({ checkIns })
    try { localStorage.setItem('rf_checkins', JSON.stringify(checkIns)) } catch {}
  },

  // Settings
  shareUrl: '',
  setShareUrl: (url) => set({ shareUrl: url }),

  // Attribution
  source: null,
  setSource: (s) => set({ source: s }),
}))

// Attribution reader — call on first mount
export function readAttribution() {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem('rf_source')
  if (stored) {
    const s = stored as Source
    if (s === 'direct' || s === 'social' || s === 'search' || s === 'referral') {
      useStore.getState().setSource(s)
    }
    return
  }
  // Parse UTM / URL params
  const params = new URLSearchParams(window.location.search)
  let source: Source = 'direct'
  const utmSource = params.get('utm_source')?.toLowerCase()
  const utmMedium = params.get('utm_medium')?.toLowerCase()
  const ref = params.get('referrer')?.toLowerCase()
  const refUrl = params.get('ref')?.toLowerCase()

  if (utmSource === 'twitter' || utmSource === 'x' || utmSource === 'instagram' || utmMedium === 'social') {
    source = 'social'
  } else if (utmSource === 'google' || utmSource === 'bing' || utmMedium === 'cpc' || utmMedium === 'organic') {
    source = 'search'
  } else if (utmSource === 'newsletter' || ref === 'friend' || refUrl) {
    source = 'referral'
  }

  localStorage.setItem('rf_source', source)
  useStore.getState().setSource(source)
}
