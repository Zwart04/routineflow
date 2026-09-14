'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { showSuccess } from '@/lib/toast';
import { Globe, Moon, Sun, Trash2, BarChart3 } from 'lucide-react';

export default function SettingsPage() {
  const { locale, setLocale, darkMode, toggleDarkMode, clearAllData, getSourceAttribution } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const sources = getSourceAttribution();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Language</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant={locale === 'en' ? 'default' : 'outline'} onClick={() => setLocale('en')}>
              <Globe className="mr-2 h-4 w-4" />English
            </Button>
            <Button variant={locale === 'id' ? 'default' : 'outline'} onClick={() => setLocale('id')}>
              <Globe className="mr-2 h-4 w-4" />Indonesia
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Source Attribution</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sources.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <BarChart3 size={16} className="text-primary" />
                <span className="font-medium">{s.source}</span>
                <span className="text-muted-foreground">({s.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          {!showConfirm ? (
            <Button variant="destructive" onClick={() => setShowConfirm(true)}>
              <Trash2 className="mr-2 h-4 w-4" />Clear All Data
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-destructive">This will delete all routines, habits, and progress. Cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={() => { clearAllData(); setShowConfirm(false); showSuccess('All data cleared.'); }}>
                  Confirm Delete
                </Button>
                <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
