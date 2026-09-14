'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { showSuccess } from '@/lib/toast';
import { Plus, Trash2, Clock } from 'lucide-react';

export default function RoutinesPage() {
  const { routines, addRoutine, deleteRoutine } = useApp();
  const [name, setName] = useState('');
  const [activities, setActivities] = useState<{ name: string; time: string; duration: string }[]>([]);
  const [showForm, setShowForm] = useState(false);

  const addActivity = () => setActivities([...activities, { name: '', time: '08:00', duration: '30' }]);
  const removeActivity = (i: number) => setActivities(activities.filter((_, idx) => idx !== i));
  const updateActivity = (i: number, field: string, value: string) => {
    const updated = [...activities];
    updated[i] = { ...updated[i], [field]: value };
    setActivities(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const acts = activities.filter(a => a.name.trim()).map((a, i) => ({ id: String(i), name: a.name, time: a.time, duration: parseInt(a.duration) || 30 }));
    addRoutine(name, acts);
    setName(''); setActivities([]); setShowForm(false);
    showSuccess('Routine created!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Routines</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2" />Add Routine</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Routine</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Routine Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Morning Routine" required />
              </div>
              <div className="space-y-2">
                <Label>Activities</Label>
                {activities.map((a, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <Input value={a.name} onChange={e => updateActivity(i, 'name', e.target.value)} placeholder="Activity name" />
                    <Input type="time" value={a.time} onChange={e => updateActivity(i, 'time', e.target.value)} className="w-32" />
                    <Input type="number" value={a.duration} onChange={e => updateActivity(i, 'duration', e.target.value)} placeholder="min" className="w-24" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeActivity(i)}><Trash2 size={16} /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addActivity}><Plus size={14} className="mr-1" />Add Activity</Button>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Routine</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {routines.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No routines yet. Create a routine to organize your day.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {routines.map(r => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{r.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => deleteRoutine(r.id)}><Trash2 size={16} /></Button>
                </div>
              </CardHeader>
              <CardContent>
                {r.activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activities</p>
                ) : (
                  <div className="space-y-2">
                    {r.activities.map(a => (
                      <div key={a.id} className="flex items-center gap-3 text-sm">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="font-mono">{a.time}</span>
                        <span>{a.name}</span>
                        <span className="text-muted-foreground">({a.duration}min)</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
