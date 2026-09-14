'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { showSuccess } from '@/lib/toast';
import { Plus, Trash2, UserCheck } from 'lucide-react';

export default function ProfilesPage() {
  const { profiles, routines, addProfile, updateProfile, deleteProfile } = useApp();
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProfile(name);
    setName('');
    setShowForm(false);
    showSuccess('Profile created!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profiles & Templates</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2" />Add Profile</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Profile</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex gap-2">
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Weekday, Weekend..." />
              <Button type="submit">Save</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {profiles.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No profiles yet. Create one to organize your routines.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {profiles.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className={p.isActive ? 'text-green-600' : 'text-muted-foreground'} size={20} />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.routines.length} routines assigned</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={p.isActive ? 'default' : 'outline'} onClick={() => updateProfile(p.id, { isActive: !p.isActive })}>
                    {p.isActive ? 'Active' : 'Activate'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteProfile(p.id)}><Trash2 size={16} /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
