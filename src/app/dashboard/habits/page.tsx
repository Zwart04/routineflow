'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { showSuccess } from '@/lib/toast';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { todayStr } from '@/lib/utils';

export default function HabitsPage() {
  const { habits, routines, addHabit, updateHabit, deleteHabit, checkInHabit, checkOutHabit } = useApp();
  const [name, setName] = useState('');
  const [routineId, setRoutineId] = useState('');
  const [unit, setUnit] = useState('');
  const [target, setTarget] = useState('1');
  const [showForm, setShowForm] = useState(false);
  const today = todayStr();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name, routineId, unit, parseInt(target) || 1);
    setName(''); setUnit(''); setTarget('1'); setShowForm(false);
    showSuccess('Habit added!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Habits</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2" />Add Habit</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Habit</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Habit Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Drink water" required />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. glasses" />
                </div>
                <div>
                  <Label>Daily Target</Label>
                  <Input type="number" value={target} onChange={e => setTarget(e.target.value)} min="1" />
                </div>
                <div>
                  <Label>Routine</Label>
                  <select value={routineId} onChange={e => setRoutineId(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3">
                    <option value="">None</option>
                    {routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {habits.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No habits yet. Create your first habit to start tracking.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {habits.map(h => {
            const done = h.completedDates.includes(today);
            return (
              <Card key={h.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => done ? checkOutHabit(h.id) : checkInHabit(h.id)}>
                      <CheckCircle2 className={done ? 'text-green-600' : 'text-muted-foreground'} size={24} />
                    </button>
                    <div>
                      <p className={`font-medium ${done ? 'line-through text-muted-foreground' : ''}`}>{h.name}</p>
                      <p className="text-sm text-muted-foreground">{h.unit}: {h.current}/{h.target} | Streak: {h.streak} | Longest: {h.longestStreak}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteHabit(h.id)}>
                    <Trash2 size={16} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
