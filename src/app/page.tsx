'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { BarChart3, Calendar, CheckCircle2, Sparkles, Share2, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const features = [
    { icon: Sparkles, title: 'AI Schedule Generator', desc: 'Intelligent daily routine generation based on your goals and preferences.' },
    { icon: CheckCircle2, title: 'Habit Tracking', desc: 'Track habits with streaks, targets, and completion analytics.' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visualize your progress with charts, heatmaps, and trends.' },
    { icon: Calendar, title: 'Calendar Export', desc: 'Export routines to iCal for Google/Apple Calendar sync.' },
    { icon: Share2, title: 'Share Progress', desc: 'Share your habit cards via WhatsApp with friends.' },
    { icon: Users, title: 'Multiple Profiles', desc: 'Manage different routines for weekdays, weekends, and more.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold">RoutineFlow</span>
          </div>
          <div className="flex gap-2">
            {mounted && user ? (
              <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
            ) : (
              <>
                <Link href="/login"><Button variant="outline">Log In</Button></Link>
                <Link href="/register"><Button>Get Started</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">AI-Powered Daily Routine Orchestrator</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Build better habits, track your progress, and optimize your daily routines with intelligent scheduling and real-time analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register"><Button size="lg">Start Free</Button></Link>
            <Link href="/login"><Button size="lg" variant="outline">Sign In</Button></Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i}>
                <CardHeader>
                  <f.icon className="text-primary mb-2" size={28} />
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
