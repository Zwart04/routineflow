'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { showSuccess } from '@/lib/toast';
import { Share2, Copy, MessageCircle } from 'lucide-react';

export default function SharePage() {
  const { habits } = useApp();
  const [cardText, setCardText] = useState('');

  const generateCard = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const completed = habits.filter(h => h.completedDates.includes(new Date().toISOString().slice(0, 10))).length;
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
    let text = 'RoutineFlow Progress\n';
    text += today + '\n';
    text += ' Habits completed: ' + completed + '/' + habits.length + '\n';
    text += ' Current streak: ' + maxStreak + ' days\n';
    if (habits.length > 0) {
      text += '\nTop habits:\n';
      habits.slice(0, 3).forEach(h => {
        text += ' ' + h.name + ' (' + h.streak + ' day streak)\n';
      });
    }
    text += '\nJoin: routineflow.zwart.qzz.io';
    setCardText(text);
    showSuccess('Card generated!');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    showSuccess('Link copied!');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(cardText || 'Check out my RoutineFlow progress!');
    window.open('https://wa.me/?text=' + text, '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Share Progress</h1>
      <Card>
        <CardHeader>
          <CardTitle>Share Your Progress</CardTitle>
          <CardDescription>Generate a habit card and share it with friends via WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={generateCard}><Share2 className="mr-2 h-4 w-4" />Generate Card</Button>
            <Button variant="outline" onClick={copyLink}><Copy className="mr-2 h-4 w-4" />Copy Link</Button>
            <Button variant="outline" onClick={shareWhatsApp}><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</Button>
          </div>
          {cardText && (
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">{cardText}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
