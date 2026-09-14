'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { showSuccess } from '@/lib/toast';
import { Download, Calendar as CalIcon } from 'lucide-react';

export default function CalendarPage() {
  const { routines } = useApp();
  const [exporting, setExporting] = useState(false);

  const generateICal = () => {
    setExporting(true);
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//RoutineFlow//EN\n';
    routines.forEach(r => {
      r.activities.forEach(a => {
        const today = new Date().toISOString().slice(0, 10);
        const start = today + 'T' + a.time + ':00';
        const endDate = new Date(new Date(start).getTime() + a.duration * 60000);
        const end = endDate.toISOString().slice(0, 19).replace(/[-:]/g, '');
        ics += 'BEGIN:VEVENT\n';
        ics += 'DTSTART:' + start.replace(/[-:]/g, '') + 'Z\n';
        ics += 'DTEND:' + end + 'Z\n';
        ics += 'SUMMARY:' + r.name + ' - ' + a.name + '\n';
        ics += 'END:VEVENT\n';
      });
    });
    ics += 'END:VCALENDAR';
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'routineflow.ics';
    link.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    showSuccess('iCal file downloaded!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar &amp; Export</h1>
      <Card>
        <CardHeader>
          <CardTitle>Export to Calendar</CardTitle>
          <CardDescription>Export your routines as an iCal file compatible with Google Calendar, Apple Calendar, and Outlook.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateICal} disabled={exporting || routines.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? 'Generating...' : 'Export iCal'}
          </Button>
          {routines.length === 0 && <p className="text-sm text-muted-foreground mt-2">Create routines first to export.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Today's Routine</CardTitle></CardHeader>
        <CardContent>
          {routines.length === 0 ? (
            <p className="text-muted-foreground text-sm">No routines scheduled.</p>
          ) : (
            <div className="space-y-3">
              {routines.map(r => (
                <div key={r.id} className="border rounded-lg p-3">
                  <p className="font-medium mb-2">{r.name}</p>
                  <div className="space-y-1">
                    {r.activities.map(a => (
                      <div key={a.id} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CalIcon size={12} />
                        <span className="font-mono">{a.time}</span>
                        <span>{a.name}</span>
                        <span>({a.duration}min)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
