'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { t } from '@/lib/i18n';
import { Bell, Check, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, locale, addNotification, clearAllData } = useApp();
  const dict = locale === 'id' ? t.id : t.en;

  const markAllRead = () => {
    addNotification('Marked all as read', 'All notifications have been read.');
  };

  const clearAll = () => {
    clearAllData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{dict.notifications.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllRead}><Check size={16} className="mr-2" />{dict.notifications.markAllRead}</Button>
          <Button variant="destructive" onClick={clearAll}><Trash2 size={16} className="mr-2" />{dict.notifications.clearAll}</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>{dict.notifications.title}</CardTitle></CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto mb-4 text-muted-foreground" size={32} />
              <p className="text-muted-foreground">{dict.notifications.notificationEmpty}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Bell size={16} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
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
