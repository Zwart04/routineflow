// ─── Types ───
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  lang: 'en' | 'id'
  goals: string[]
  chronotype: 'morning' | 'evening' | 'neutral'
  availableHours: number
}

export interface Routine {
  id: string
  name: string
  description: string
  profile: 'weekday' | 'weekend' | 'sick'
  habits: Habit[]
  createdAt: string
  updatedAt: string
}

export interface Habit {
  id: string
  name: string
  description: string
  category: string
  priority: number
  duration: number
  timeSlot: string
  target: number
}

export interface CheckIn {
  id: string
  habitId: string
  routineId: string
  date: string
  completed: boolean
  timestamp: string
}

export interface Streak {
  habitId: string
  current: number
  longest: number
  lastDate: string
}

export interface JournalEntry {
  id: string
  date: string
  productivity: number
  timeInvested: number
  habitsCompleted: number
  habitsTotal: number
  notes: string
  source: string
}

export interface SourceAttribution {
  source: string
  count: number
}

export interface AnalyticsData {
  completionRates: { habitId: string; rate: number; name: string }[]
  streaks: Streak[]
  dailyCompletion: { date: string; completed: number; total: number }[]
  heatmapData: { date: string; count: number }[]
}

export interface Correlation {
  habitA: string
  habitB: string
  coefficient: number
}