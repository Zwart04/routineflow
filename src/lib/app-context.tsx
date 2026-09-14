'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Habit, Routine, Profile, AppNotification, User, UserPreferences } from './types';
import { uid, todayStr } from './utils';
import { t, Locale, TranslationDict } from './i18n';

interface AppContextType {
  user: User | null;
  habits: Habit[];
  routines: Routine[];
  profiles: Profile[];
  notifications: AppNotification[];
  locale: Locale;
  setLocale: (l: Locale) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  login: (email: string, password: string) => boolean;
  register: (email: string, name: string, password: string) => boolean;
  logout: () => void;
  addHabit: (name: string, routineId: string, unit: string, target: number) => void;
  updateHabit: (id: string, data: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  checkInHabit: (id: string) => void;
  checkOutHabit: (id: string) => void;
  addRoutine: (name: string, activities: { id: string; name: string; time: string; duration: number }[]) => void;
  updateRoutine: (id: string, data: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  addProfile: (name: string) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  addNotification: (title: string, message: string) => void;
  clearAllData: () => void;
  getSourceAttribution: () => { source: string; count: number }[];
  todayStr: string;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'routineflow_user';
const USERS_KEY = 'routineflow_users';
const DATA_KEY = 'routineflow_data';

const DEFAULT_USER: User = {
  id: 'default',
  email: 'demo@routineflow.app',
  name: 'Demo User',
  password: 'demo123',
  createdAt: new Date().toISOString(),
  preferences: { language: 'en', darkMode: false, notificationsEnabled: true, weeklyDigestEnabled: true },
};

function loadUsers(): User[] {
  if (typeof window === 'undefined') return [DEFAULT_USER];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users: User[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(users)) return [DEFAULT_USER];
    if (!users.find(u => u.id === 'default')) users.push(DEFAULT_USER);
    return users;
  } catch { return [DEFAULT_USER]; }
}

function saveUsers(users: User[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadData(userId: string) {
  if (typeof window === 'undefined') return { habits: [], routines: [], profiles: [], notifications: [] };
  try {
    const raw = localStorage.getItem(DATA_KEY + '_' + userId);
    return raw ? JSON.parse(raw) : { habits: [], routines: [], profiles: [], notifications: [] };
  } catch { return { habits: [], routines: [], profiles: [], notifications: [] }; }
}

function saveData(userId: string, data: { habits: Habit[]; routines: Routine[]; profiles: Profile[]; notifications: AppNotification[] }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DATA_KEY + '_' + userId, JSON.stringify(data));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [locale, setLocaleState] = useState<Locale>('en');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const u = JSON.parse(raw) as User;
        setUser(u);
        setLocaleState(u.preferences.language);
        setDarkMode(u.preferences.darkMode);
        const data = loadData(u.id);
        setHabits(data.habits || []);
        setRoutines(data.routines || []);
        setProfiles(data.profiles || []);
        setNotifications(data.notifications || []);
      } catch {}
    }
    const params = new URLSearchParams(window.location.search);
    const src = params.get('utm_source');
    if (src && !localStorage.getItem('routineflow_source')) {
      localStorage.setItem('routineflow_source', src);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, preferences: { ...prev.preferences, language: l } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      setUser(u => {
        if (!u) return u;
        const updated = { ...u, preferences: { ...u.preferences, darkMode: newMode } };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      return newMode;
    });
  }, []);

  const addNotification = useCallback((title: string, message: string) => {
    const n: AppNotification = { id: uid(), title, message, read: false, createdAt: new Date().toISOString() };
    setNotifications(prev => {
      const updated = [n, ...prev];
      if (user) saveData(user.id, { habits, routines, profiles, notifications: updated });
      return updated;
    });
  }, [user, habits, routines, profiles]);

  const login = useCallback((email: string, password: string): boolean => {
    const users = loadUsers();
    const u = users.find(u => u.email === email && u.password === password);
    if (!u) return false;
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    const data = loadData(u.id);
    setHabits(data.habits || []);
    setRoutines(data.routines || []);
    setProfiles(data.profiles || []);
    setNotifications(data.notifications || []);
    setLocaleState(u.preferences.language);
    setDarkMode(u.preferences.darkMode);
    return true;
  }, []);

  const register = useCallback((email: string, name: string, password: string): boolean => {
    const users = loadUsers();
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: uid(), email, name, password, createdAt: new Date().toISOString(),
      preferences: { language: 'en', darkMode: false, notificationsEnabled: true, weeklyDigestEnabled: true },
    };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setHabits([]);
    setRoutines([]);
    setProfiles([]);
    setNotifications([]);
    return true;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(null);
    setHabits([]);
    setRoutines([]);
    setProfiles([]);
    setNotifications([]);
  }, []);

  const addHabit = useCallback((name: string, routineId: string, unit: string, target: number) => {
    const h: Habit = { id: uid(), name, routineId, unit, target, current: 0, streak: 0, longestStreak: 0, lastCompleted: null, completedDates: [], createdAt: new Date().toISOString() };
    setHabits(prev => {
      const updated = [...prev, h];
      if (user) saveData(user.id, { habits: updated, routines, profiles, notifications });
      return updated;
    });
    addNotification('Habit Added', name + ' has been added to your habits.');
  }, [user, routines, profiles, notifications, addNotification]);

  const updateHabit = useCallback((id: string, data: Partial<Habit>) => {
    setHabits(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, ...data } : h);
      if (user) saveData(user.id, { habits: updated, routines, profiles, notifications });
      return updated;
    });
  }, [user, routines, profiles, notifications]);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== id);
      if (user) saveData(user.id, { habits: updated, routines, profiles, notifications });
      return updated;
    });
  }, [user, routines, profiles, notifications]);

  const checkInHabit = useCallback((id: string) => {
    setHabits(prev => {
      const today = todayStr();
      const updated = prev.map(h => {
        if (h.id !== id) return h;
        if (h.completedDates.includes(today)) return h;
        const newDates = [...h.completedDates, today];
        const streakInfo = calculateStreak(newDates);
        return { ...h, completedDates: newDates, current: h.current + 1, streak: streakInfo.current, longestStreak: streakInfo.longest, lastCompleted: today };
      });
      if (user) saveData(user.id, { habits: updated, routines, profiles, notifications });
      return updated;
    });
  }, [user, routines, profiles, notifications]);

  const checkOutHabit = useCallback((id: string) => {
    setHabits(prev => {
      const today = todayStr();
      const updated = prev.map(h => {
        if (h.id !== id) return h;
        if (!h.completedDates.includes(today)) return h;
        const newDates = h.completedDates.filter(d => d !== today);
        const streakInfo = calculateStreak(newDates);
        return { ...h, completedDates: newDates, current: Math.max(0, h.current - 1), streak: streakInfo.current, longestStreak: streakInfo.longest };
      });
      if (user) saveData(user.id, { habits: updated, routines, profiles, notifications });
      return updated;
    });
  }, [user, routines, profiles, notifications]);

  const addRoutine = useCallback((name: string, activities: { id: string; name: string; time: string; duration: number }[]) => {
    const r: Routine = { id: uid(), name, activities, isActive: true };
    setRoutines(prev => {
      const updated = [...prev, r];
      if (user) saveData(user.id, { habits, routines: updated, profiles, notifications });
      return updated;
    });
    addNotification('Routine Added', '\"' + name + '\" routine has been created.');
  }, [user, habits, profiles, notifications, addNotification]);

  const updateRoutine = useCallback((id: string, data: Partial<Routine>) => {
    setRoutines(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...data } : r);
      if (user) saveData(user.id, { habits, routines: updated, profiles, notifications });
      return updated;
    });
  }, [user, habits, profiles, notifications]);

  const deleteRoutine = useCallback((id: string) => {
    setRoutines(prev => {
      const updated = prev.filter(r => r.id !== id);
      if (user) saveData(user.id, { habits, routines: updated, profiles, notifications });
      return updated;
    });
  }, [user, habits, profiles, notifications]);

  const addProfile = useCallback((name: string) => {
    const pr: Profile = { id: uid(), name, routines: [], isActive: false, createdAt: new Date().toISOString() };
    setProfiles(prev => {
      const updated = [...prev, pr];
      if (user) saveData(user.id, { habits, routines, profiles: updated, notifications });
      return updated;
    });
  }, [user, habits, routines, notifications]);

  const updateProfile = useCallback((id: string, data: Partial<Profile>) => {
    setProfiles(prev => {
      const updated = prev.map(pr => pr.id === id ? { ...pr, ...data } : pr);
      if (user) saveData(user.id, { habits, routines, profiles: updated, notifications });
      return updated;
    });
  }, [user, habits, routines, notifications]);

  const deleteProfile = useCallback((id: string) => {
    setProfiles(prev => {
      const updated = prev.filter(pr => pr.id !== id);
      if (user) saveData(user.id, { habits, routines, profiles: updated, notifications });
      return updated;
    });
  }, [user, habits, routines, notifications]);

  const clearAllData = useCallback(() => {
    setHabits([]);
    setRoutines([]);
    setProfiles([]);
    setNotifications([]);
    if (user) saveData(user.id, { habits: [], routines: [], profiles: [], notifications: [] });
  }, [user]);

  const getSourceAttribution = useCallback((): { source: string; count: number }[] => {
    if (typeof window === 'undefined') return [{ source: 'direct', count: 1 }];
    const src = localStorage.getItem('routineflow_source');
    return src ? [{ source: src, count: 1 }] : [{ source: 'direct', count: 1 }];
  }, []);

  const value: AppContextType = {
    user, habits, routines, profiles, notifications, locale, setLocale, darkMode, toggleDarkMode,
    login, register, logout, addHabit, updateHabit, deleteHabit, checkInHabit, checkOutHabit,
    addRoutine, updateRoutine, deleteRoutine, addProfile, updateProfile, deleteProfile,
    addNotification, clearAllData, getSourceAttribution,
    todayStr: todayStr(),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function calculateStreak(completedDates: string[]): { current: number; longest: number } {
  if (!completedDates || completedDates.length === 0) return { current: 0, longest: 0 };
  const sorted = [...completedDates].sort();
  let longest = 1, currentRun = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T12:00:00').getTime();
    const curr = new Date(sorted[i] + 'T12:00:00').getTime();
    if ((curr - prev) === 86400000) {
      currentRun++;
      longest = Math.max(longest, currentRun);
    } else {
      currentRun = 1;
    }
  }
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let currentStreak = 0;
  if (sorted.includes(today) || sorted.includes(yesterday)) {
    const last = sorted[sorted.length - 1];
    const check = new Date(last + 'T12:00:00');
    while (sorted.includes(check.toISOString().slice(0, 10))) {
      currentStreak++;
      check.setDate(check.getDate() - 1);
    }
  }
  return { current: currentStreak, longest };
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
