'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { CheckCircle2, Flame, TrendingUp, Target } from 'lucide-react';
import { todayStr } from '@/lib/utils';

export default function DashboardPage() {
  const { habits, routines, todayStr } = useApp();
  const today = todayStr;

  const todayHabits = habits.filter(h => h.completedDates.includes(today));
  const totalHabits = habits.length;
  const completedToday = todayHabits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  const stats = [
    { label: 'Completion Rate', value: `${completionRate}%`, icon: Target, color: 'text-green-600' },
    { label: 'Current Streak', value: maxStreak, icon: Flame, color: 'text-orange-600' },
    { label: 'Longest Streak', value: longestStreak, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Active Routines', value: routines.length, icon: CheckCircle2, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <s.icon className={s.color} size={24} />
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <p className="text-muted-foreground text-sm">No habits yet. Go to the Habits tab to create your first one.</p>
          ) : (
            <div className="space-y-2">
              {habits.map(h => {
                const done = h.completedDates.includes(today);
                return (
                  <div key={h.id} className={`flex items-center justify-between p-3 rounded-lg border ${done ? 'bg-green-50 border-green-200' : 'bg-card'}`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={done ? 'text-green-600' : 'text-muted-foreground'} size={20} />
                      <span className={done ? 'line-through text-muted-foreground' : ''}>{h.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{h.unit}: {h.current}/{h.target}</span>
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
