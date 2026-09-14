#!/usr/bin/env python3
"""Generate RoutineFlow — clean Next.js 16 + TS + Tailwind v4 project."""
import os

BASE = "/home/ubuntu/daily-projects/zwart-2026-09-14-routineflow"

def p(*parts):
    return os.path.join(BASE, *parts)

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"  {os.path.relpath(path, BASE)}")

# ── globals.css (Tailwind v4 CSS-first) ──
w(p("src/app/globals.css"), r'''@import "tailwindcss";

@theme {
  --color-background: 0 0% 100%;
  --color-foreground: 222 47% 11%;
  --color-card: 0 0% 100%;
  --color-card-foreground: 222 47% 11%;
  --color-primary: 221 83% 53%;
  --color-primary-foreground: 0 0% 100%;
  --color-secondary: 210 40% 96%;
  --color-secondary-foreground: 222 47% 11%;
  --color-muted: 210 40% 96%;
  --color-muted-foreground: 215 16% 47%;
  --color-accent: 210 40% 96%;
  --color-accent-foreground: 222 47% 11%;
  --color-destructive: 0 84% 60%;
  --color-destructive-foreground: 0 0% 100%;
  --color-border: 214 32% 91%;
  --color-input: 214 32% 91%;
  --color-ring: 221 83% 53%;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: 222 47% 8%;
    --color-foreground: 210 40% 98%;
    --color-card: 222 47% 11%;
    --color-card-foreground: 210 40% 98%;
    --color-primary: 217 91% 60%;
    --color-primary-foreground: 0 0% 100%;
    --color-secondary: 217 33% 17%;
    --color-secondary-foreground: 210 40% 98%;
    --color-muted: 217 33% 17%;
    --color-muted-foreground: 215 20% 65%;
    --color-accent: 217 33% 17%;
    --color-accent-foreground: 210 40% 98%;
    --color-destructive: 0 63% 31%;
    --color-destructive-foreground: 210 40% 98%;
    --color-border: 217 33% 17%;
    --color-input: 217 33% 17%;
    --color-ring: 224 76% 48%;
  }
}

* { border-color: hsl(var(--border)); }
body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); }
''')

# ── types.ts ──
w(p("src/lib/types.ts"), r'''export interface Habit {
  id: string;
  name: string;
  routineId: string;
  unit: string;
  target: number;
  current: number;
  streak: number;
  longestStreak: number;
  lastCompleted: string | null;
  completedDates: string[];
  createdAt: string;
}

export interface Routine {
  id: string;
  name: string;
  activities: { id: string; name: string; time: string; duration: number }[];
  isActive: boolean;
}

export interface Profile {
  id: string;
  name: string;
  routines: string[];
  isActive: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UserPreferences {
  language: 'en' | 'id';
  darkMode: boolean;
  notificationsEnabled: boolean;
  weeklyDigestEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  preferences: UserPreferences;
}
''')

# ── utils.ts ──
w(p("src/lib/utils.ts"), r'''export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDayName(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function getWeekNumber(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const oneJan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
}

export function correlation(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const xi = x[i] - mx, yi = y[i] - my;
    num += xi * yi;
    dx += xi * xi;
    dy += yi * yi;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}
''')

# ── i18n.ts ──
w(p("src/lib/i18n.ts"), r'''export const t = {
  en: {
    appName: 'RoutineFlow',
    tagline: 'AI-powered daily routine orchestrator',
    nav: {
      dashboard: 'Dashboard', routines: 'Routines', habits: 'Habits',
      aiGenerator: 'AI Generator', analytics: 'Analytics', calendar: 'Calendar',
      share: 'Share', profiles: 'Profiles', notifications: 'Notifications',
      digest: 'Digest', settings: 'Settings', login: 'Log In', register: 'Register',
    },
    auth: {
      email: 'Email', password: 'Password', name: 'Full name',
      loginTitle: 'Welcome back', registerTitle: 'Join RoutineFlow',
      loginSubtitle: 'Sign in to continue', registerSubtitle: 'Create your account',
      noAccount: "Don't have an account? ", haveAccount: 'Already have an account? ',
      invalidCredentials: 'Invalid email or password', emailExists: 'Email already registered',
    },
    common: { loading: 'Loading...', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add', close: 'Close', confirm: 'Confirm', yes: 'Yes', no: 'No' },
    dashboard: {
      dashboard: 'Dashboard', todaySchedule: "Today's Schedule", completionRate: 'Completion Rate',
      currentStreak: 'Current Streak', longestStreak: 'Longest Streak', thisWeek: 'This Week',
      daysActive: '{n} activities done', emptySchedule: 'No activities scheduled.',
    },
    habits: {
      title: 'Habits', addHabit: 'Add Habit', editHabit: 'Edit Habit', deleteHabit: 'Delete Habit',
      habitName: 'Habit Name', unit: 'Unit', target: 'Daily Target', current: 'Current',
      streak: 'Streak', longestStreak: 'Longest Streak', lastCompleted: 'Last Completed',
      noHabits: 'No habits yet.', checkIn: 'Check In', checkOut: 'Check Out',
      checkInSuccess: 'Habit checked in!', checkOutSuccess: 'Habit unchecked.',
    },
    routines: {
      title: 'Routines', addRoutine: 'Add Routine', editRoutine: 'Edit Routine',
      routineName: 'Routine Name', activities: 'Activities', addActivity: 'Add Activity',
      activityName: 'Activity Name', time: 'Time (HH:MM)', duration: 'Duration (min)',
      noRoutines: 'No routines yet.',
    },
    'ai-generator': {
      title: 'AI Routine Generator', description: 'Describe your goal and preferences.',
      goalLabel: 'Main goal', hoursLabel: 'Hours available',
      preferencesLabel: 'Preferences (optional)', preferencesPlaceholder: 'e.g. morning workouts, 8h sleep...',
      generateButton: 'Generate Routine', generating: 'Generating...', generated: 'Routine generated!',
      applyButton: 'Apply', clearButton: 'Clear',
    },
    analytics: {
      title: 'Analytics', weeklyProgress: 'Weekly Progress', monthlyTrend: 'Monthly Trend',
      completionByHabit: 'Completion by Habit', streakHistory: 'Streak History',
      totalCheckIns: 'Total Check-ins', averageDaily: 'Average Daily',
      bestDay: 'Best Day', busiestDay: 'Busiest Day', noData: 'Not enough data yet.',
    },
    calendar: {
      title: 'Calendar & Export', description: 'Export your routine as iCal.',
      exportButton: 'Export iCal', exportSuccess: 'Downloaded!',
      todayView: "Today's Routine", weekView: 'Week View', noEvents: 'No events.',
    },
    share: {
      title: 'Share Progress', description: 'Share your habit card via WhatsApp.',
      generateCard: 'Generate Card', shareWhatsapp: 'Share via WhatsApp',
      shareCopyLink: 'Copy Link', cardGenerated: 'Card generated!',
      shareSuccess: 'Link copied!', weeklySummary: 'Weekly Summary',
      habitsCompleted: 'Habits Completed', currentStreak: 'Current Streak',
    },
    profiles: {
      title: 'Profiles & Templates', description: 'Manage routine profiles.',
      addProfile: 'Add Profile', editProfile: 'Edit Profile', deleteProfile: 'Delete Profile',
      profileName: 'Profile Name', selectRoutines: 'Select Routines', activateProfile: 'Activate',
      noProfiles: 'No profiles yet.',
    },
    notifications: { title: 'Notifications', markAllRead: 'Mark All Read', clearAll: 'Clear All', notificationEmpty: 'No notifications.' },
    digest: {
      title: 'Weekly Digest', description: 'Your weekly summary.',
      thisWeek: 'This Week', lastWeek: 'Last Week', totalActivities: 'Total Activities',
      completionRate: 'Completion Rate', newStreaks: 'New Streaks', bestStreak: 'Best Streak',
      noData: 'Not enough data for digest.',
    },
    settings: {
      title: 'Settings', language: 'Language', theme: 'Theme', darkMode: 'Dark Mode',
      notificationsEnabled: 'Notifications', weeklyDigestEnabled: 'Weekly Digest',
      clearData: 'Clear All Data', clearDataConfirm: 'This deletes all data. Cannot be undone.',
      sourceChart: 'Source Attribution',
    },
  },
  id: {
    appName: 'RoutineFlow',
    tagline: 'Pengatur rutinitas harian berbasis AI',
    nav: {
      dashboard: 'Beranda', routines: 'Rutinitas', habits: 'Kebiasaan',
      aiGenerator: 'AI Generator', analytics: 'Analitik', calendar: 'Kalender',
      share: 'Bagikan', profiles: 'Profil', notifications: 'Notifikasi',
      digest: 'Ringkasan', settings: 'Pengaturan', login: 'Masuk', register: 'Daftar',
    },
    auth: {
      email: 'Email', password: 'Kata sandi', name: 'Nama lengkap',
      loginTitle: 'Selamat datang kembali', registerTitle: 'Gabung dengan RoutineFlow',
      loginSubtitle: 'Masuk untuk melanjutkan', registerSubtitle: 'Buat akun Anda',
      noAccount: 'Belum punya akun? ', haveAccount: 'Sudah punya akun? ',
      invalidCredentials: 'Email atau kata sandi salah', emailExists: 'Email sudah terdaftar',
    },
    common: { loading: 'Loading...', save: 'Simpan', cancel: 'Batal', delete: 'Hapus', edit: 'Edit', add: 'Tambah', close: 'Tutup', confirm: 'Konfirmasi', yes: 'Ya', no: 'Tidak' },
    dashboard: {
      dashboard: 'Beranda', todaySchedule: 'Jadwal Hari Ini', completionRate: 'Tingkat Selesai',
      currentStreak: 'Streak Saat Ini', longestStreak: 'Streak Terlama', thisWeek: 'Minggu Ini',
      daysActive: '{n} aktivitas selesai', emptySchedule: 'Tidak ada aktivitas terjadwal.',
    },
    habits: {
      title: 'Kebiasaan', addHabit: 'Tambah Kebiasaan', editHabit: 'Edit Kebiasaan', deleteHabit: 'Hapus Kebiasaan',
      habitName: 'Nama Kebiasaan', unit: 'Satuan', target: 'Target Harian', current: 'Saat Ini',
      streak: 'Streak', longestStreak: 'Streak Terlama', lastCompleted: 'Terakhir Selesai',
      noHabits: 'Belum ada kebiasaan.', checkIn: 'Tandai Selesai', checkOut: 'Tandai Belum',
      checkInSuccess: 'Kebiasaan tercatat!', checkOutSuccess: 'Kebiasaan ditandai belum.',
    },
    routines: {
      title: 'Rutinitas', addRoutine: 'Tambah Rutinitas', editRoutine: 'Edit Rutinitas',
      routineName: 'Nama Rutinitas', activities: 'Aktivitas', addActivity: 'Tambah Aktivitas',
      activityName: 'Nama Aktivitas', time: 'Waktu (HH:MM)', duration: 'Durasi (menit)',
      noRoutines: 'Belum ada rutinitas.',
    },
    'ai-generator': {
      title: 'AI Routine Generator', description: 'Jelaskan tujuan dan preferensi Anda.',
      goalLabel: 'Tujuan utama', hoursLabel: 'Jam tersedia',
      preferencesLabel: 'Preferensi (opsional)', preferencesPlaceholder: 'misal olahraga pagi, tidur 8 jam...',
      generateButton: 'Buat Rutinitas', generating: 'Membuat...', generated: 'Rutinitas dibuat!',
      applyButton: 'Terapkan', clearButton: 'Hapus',
    },
    analytics: {
      title: 'Analitik', weeklyProgress: 'Progress Mingguan', monthlyTrend: 'Tren Bulanan',
      completionByHabit: 'Selesai per Kebiasaan', streakHistory: 'Riwayat Streak',
      totalCheckIns: 'Total Pencatatan', averageDaily: 'Rata-rata Harian',
      bestDay: 'Hari Terbaik', busiestDay: 'Hari Paling Padat', noData: 'Belum cukup data.',
    },
    calendar: {
      title: 'Kalender & Ekspor', description: 'Ekspor rutinitas sebagai iCal.',
      exportButton: 'Ekspor iCal', exportSuccess: 'Diunduh!',
      todayView: 'Jadwal Hari Ini', weekView: 'Lihat Minggu', noEvents: 'Tidak ada aktivitas.',
    },
    share: {
      title: 'Bagikan Progress', description: 'Bagikan kartu kebiasaan via WhatsApp.',
      generateCard: 'Buat Kartu', shareWhatsapp: 'Bagikan via WhatsApp',
      shareCopyLink: 'Salin Link', cardGenerated: 'Kartu dibuat!',
      shareSuccess: 'Link disalin!', weeklySummary: 'Ringkasan Mingguan',
      habitsCompleted: 'Kebiasaan Selesai', currentStreak: 'Streak Saat Ini',
    },
    profiles: {
      title: 'Profil & Template', description: 'Kelola profil rutinitas.',
      addProfile: 'Tambah Profil', editProfile: 'Edit Profil', deleteProfile: 'Hapus Profil',
      profileName: 'Nama Profil', selectRoutines: 'Pilih Rutinitas', activateProfile: 'Aktifkan',
      noProfiles: 'Belum ada profil.',
    },
    notifications: { title: 'Notifikasi', markAllRead: 'Tandai Semua Dibaca', clearAll: 'Hapus Semua', notificationEmpty: 'Belum ada notifikasi.' },
    digest: {
      title: 'Ringkasan Mingguan', description: 'Ringkasan mingguan Anda.',
      thisWeek: 'Minggu Ini', lastWeek: 'Minggu Lalu', totalActivities: 'Total Aktivitas',
      completionRate: 'Tingkat Selesai', newStreaks: 'Streak Baru', bestStreak: 'Streak Terbaik',
      noData: 'Belum cukup data untuk ringkasan.',
    },
    settings: {
      title: 'Pengaturan', language: 'Bahasa', theme: 'Tema', darkMode: 'Mode Gelap',
      notificationsEnabled: 'Notifikasi', weeklyDigestEnabled: 'Ringkasan Mingguan',
      clearData: 'Hapus Semua Data', clearDataConfirm: 'Menghapus semua data. Tidak bisa dibatalkan.',
      sourceChart: 'Atribusi Sumber',
    },
  },
} as const;

export type Locale = 'en' | 'id';
export type TranslationDict = typeof t.en;
''')

# ── toast.tsx ──
w(p("src/lib/toast.tsx"), r'''import { toast } from 'sonner';

export function showSuccess(message: string) {
  toast.success(message);
}

export function showError(message: string) {
  toast.error(message);
}

export function showInfo(message: string) {
  toast.info(message);
}
''')

print("Base files written.")
''')