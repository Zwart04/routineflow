'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { t } from '@/lib/i18n';
import { CalendarDays, TrendingUp, Award, Star } from 'lucide-react';

export default function DigestPage() {
  const { habits, routines, locale } = useApp();
  const dict = locale === 'id' ? t.id : t.en;
  const today = new Date().toISOString().slice(0, 10);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  const todayCompleted = habits.filter(h => h.completedDates.includes(today)).length;
  const weekCompleted = habits.filter(h => h.completedDates.some(d => weekDays.includes(d))).length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{dict.digest.title}</h1>
      <p className="text-muted-foreground">{dict.digest.description}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <CalendarDays className="mx-auto text-primary mb-2" size={28} />
            <p className="text-2xl font-bold">{todayCompleted}</p>
            <p className="text-xs text-muted-foreground">{dict.dashboard.todaySchedule}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="mx-auto text-green-600 mb-2" size={28} />
            <p className="text-2xl font-bold">{weekCompleted}</p>
            <p className="text-xs text-muted-foreground">{dict.digest.thisWeek}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="mx-auto text-orange-600 mb-2" size={28} />
            <p className="text-2xl font-bold">{maxStreak}</p>
            <p className="text-xs text-muted-foreground">{dict.dashboard.currentStreak}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="mx-auto text-yellow-600 mb-2" size={28} />
            <p className="text-2xl font-bold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">{dict.dashboard.longestStreak}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{dict.digest.thisWeek}</CardTitle></CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <p className="text-muted-foreground text-sm">{dict.digest.noData}</p>
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 5).map(h => {
                const weekCount = h.completedDates.filter(d => weekDays.includes(d)).length;
                return (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded bg-muted/50">
                    <span className="font-medium">{h.name}</span>
                    <span className="text-sm">{weekCount}/7 days</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
