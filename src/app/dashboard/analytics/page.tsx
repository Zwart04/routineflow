'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getLastNDays, todayStr } from '@/lib/utils';

export default function AnalyticsPage() {
  const { habits } = useApp();
  const days = getLastNDays(7);

  const weeklyData = days.map(d => {
    const count = habits.filter(h => h.completedDates.includes(d)).length;
    return { day: d.slice(5), count };
  });

  const streakData = habits.slice(0, 5).map(h => ({
    name: h.name.slice(0, 10),
    streak: h.streak,
    longest: h.longestStreak,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Weekly Progress</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Streak Comparison</CardTitle></CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <p className="text-muted-foreground text-sm">No data yet. Start tracking habits to see analytics.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={streakData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="streak" stroke="hsl(var(--primary))" name="Current" />
                  <Line type="monotone" dataKey="longest" stroke="hsl(var(--muted-foreground))" name="Longest" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
