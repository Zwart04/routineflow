'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { showSuccess } from '@/lib/toast';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AIGeneratorPage() {
  const { addRoutine } = useApp();
  const [goal, setGoal] = useState('productivity');
  const [hours, setHours] = useState('8');
  const [preferences, setPreferences] = useState('');
  const [generated, setGenerated] = useState<{ name: string; activities: { name: string; time: string; duration: number }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const templates: Record<string, { name: string; activities: { name: string; time: string; duration: number }[] }> = {
        productivity: { name: 'Productivity Routine', activities: [
          { name: 'Morning Planning', time: '07:00', duration: 15 },
          { name: 'Deep Work Block 1', time: '07:30', duration: 90 },
          { name: 'Break', time: '09:00', duration: 15 },
          { name: 'Deep Work Block 2', time: '09:15', duration: 90 },
          { name: 'Lunch', time: '11:00', duration: 30 },
          { name: 'Meetings', time: '13:00', duration: 60 },
          { name: 'Deep Work Block 3', time: '14:00', duration: 90 },
          { name: 'Review & Plan Tomorrow', time: '16:00', duration: 30 },
        ]},
        fitness: { name: 'Fitness Routine', activities: [
          { name: 'Wake Up', time: '05:30', duration: 15 },
          { name: 'Warm Up', time: '05:45', duration: 15 },
          { name: 'Main Workout', time: '06:00', duration: 60 },
          { name: 'Cool Down', time: '07:00', duration: 15 },
          { name: 'Breakfast', time: '07:30', duration: 30 },
          { name: 'Hydration', time: '08:00', duration: 5 },
          { name: 'Mobility Work', time: '17:00', duration: 30 },
        ]},
        study: { name: 'Study Routine', activities: [
          { name: 'Morning Review', time: '07:00', duration: 30 },
          { name: 'Deep Study Block 1', time: '08:00', duration: 60 },
          { name: 'Break', time: '09:00', duration: 15 },
          { name: 'Deep Study Block 2', time: '09:15', duration: 60 },
          { name: 'Lunch', time: '12:00', duration: 45 },
          { name: 'Practice Problems', time: '14:00', duration: 60 },
          { name: 'Review & Notes', time: '16:00', duration: 45 },
        ]},
        balanced: { name: 'Balanced Routine', activities: [
          { name: 'Morning Meditation', time: '06:30', duration: 15 },
          { name: 'Exercise', time: '07:00', duration: 45 },
          { name: 'Breakfast', time: '08:00', duration: 30 },
          { name: 'Focused Work', time: '09:00', duration: 120 },
          { name: 'Lunch', time: '12:00', duration: 45 },
          { name: 'Personal Project', time: '14:00', duration: 60 },
          { name: 'Evening Wind Down', time: '19:00', duration: 30 },
        ]},
      };
      setGenerated(templates[goal] || templates.balanced);
      setLoading(false);
    }, 1500);
  };

  const apply = () => {
    if (!generated) return;
    const acts = generated.activities.map((a, i) => ({ id: String(i), ...a }));
    addRoutine(generated.name, acts);
    showSuccess('Routine applied!');
    setGenerated(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Routine Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" />Smart Schedule Generator</CardTitle>
          <CardDescription>Describe your goal and preferences. The algorithm will generate an optimized daily routine.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Main Goal</Label>
            <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 mt-1">
              <option value="productivity">Productivity</option>
              <option value="fitness">Fitness</option>
              <option value="study">Studying</option>
              <option value="balanced">Balanced Life</option>
            </select>
          </div>
          <div>
            <Label>Hours Available</Label>
            <Input type="number" value={hours} onChange={e => setHours(e.target.value)} min="1" max="24" />
          </div>
          <div>
            <Label>Preferences (optional)</Label>
            <Input value={preferences} onChange={e => setPreferences(e.target.value)} placeholder="e.g. morning workouts, 8h sleep..." />
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : 'Generate Routine'}
          </Button>
        </CardContent>
      </Card>

      {generated && (
        <Card>
          <CardHeader>
            <CardTitle>{generated.name}</CardTitle>
            <CardDescription>Generated routine — {generated.activities.length} activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {generated.activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded bg-muted/50">
                  <span className="font-mono text-sm w-16">{a.time}</span>
                  <span className="flex-1">{a.name}</span>
                  <span className="text-sm text-muted-foreground">{a.duration}min</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={apply}>Apply to My Routines</Button>
              <Button variant="outline" onClick={() => setGenerated(null)}>Clear</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
