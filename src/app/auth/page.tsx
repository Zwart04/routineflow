'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/lib/app-context';
import { showError, showSuccess } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useApp();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (login(email, password)) {
        showSuccess('Welcome back!');
        router.push('/dashboard');
      } else {
        showError('Invalid email or password');
      }
    } else {
      if (!name.trim()) { showError('Name is required'); return; }
      if (register(email, name, password)) {
        showSuccess('Account created!');
        router.push('/dashboard');
      } else {
        showError('Email already registered');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Welcome back' : 'Join RoutineFlow'}</CardTitle>
          <CardDescription>{isLogin ? 'Sign in to continue' : 'Create your account'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label>Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full">{isLogin ? 'Sign In' : 'Create Account'}</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-0">
              {isLogin ? 'Register' : 'Log In'}
            </Button>
          </div>
          <div className="mt-4 p-3 bg-muted rounded text-xs text-muted-foreground">
            Demo: demo@routineflow.app / demo123
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
