export function cn(...classes: (string | false | undefined | null)[]) {
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

export function getStreakInfo(completedDates: string[]): { current: number; longest: number } {
  if (!completedDates || completedDates.length === 0) return { current: 0, longest: 0 };
  const sorted = [...completedDates].sort();
  let longest = 1, current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T12:00:00').getTime();
    const curr = new Date(sorted[i] + 'T12:00:00').getTime();
    if ((curr - prev) === 86400000) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
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
