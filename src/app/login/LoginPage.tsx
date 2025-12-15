
'use client';
import React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';
import PageTransition from '../components/PageTransition';

export function LoginPage() {


  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const userCookie = cookies.find(c => c.startsWith('user='));
      if (userCookie && userCookie.length > 5) {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        try {
          localStorage.setItem('kinddrop_user', JSON.stringify(data.user));
        } catch (storageErr) {
          console.error(storageErr);
        }
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Logo textSize="text-3xl" centered />
        </div>

        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold mb-2 text-glow">Welcome Back</h1>
          <p className="mb-6">Log in to continue spreading brightness</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-glass w-full"
                placeholder="Choose a handle (not your real name)"
              />
            </div>

            <div>
              <label className="block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass w-full"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-glow w-full py-3">
              Log In
            </button>
            <p className="text-white/60 text-xs mt-2 text-center">Please do NOT use your real name as your username.</p>
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>

          <p className="mt-6 text-center">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[var(--primary)] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}

export default LoginPage;
