export interface Habit {
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
