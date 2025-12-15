
'use client';
import React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';
import PageTransition from '../components/PageTransition';

export function SignUpPage() {


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
    const cleaned = username.trim();
    const pattern = /^[A-Za-z0-9_]{3,20}$/;
    if (!pattern.test(cleaned)) {
      setError('Username must be 3-20 chars, only letters, numbers, or underscores.');
      return;
    }
    // Client-side profanity check for fast feedback (server validates too)
    try {
      const resProf = await fetch('/api/profanity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned })
      });
      if (resProf.ok) {
        const dataProf = await resProf.json();
        if (dataProf.flagged) {
          setError('Please choose a different username (profanity detected).');
          return;
        }
      }
    } catch {}
    
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: cleaned, password })
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
        setError(data.error || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Logo textSize="text-3xl" centered />
        </div>

        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold mb-2 text-glow">Create Account</h1>
          <p className="mb-6">Pick a username and password to join.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-glass w-full"
                placeholder="Choose a handle (not your real name)"
                required
              />
              <p className="text-white/60 text-xs mt-1">Please do NOT use your real name as your username.</p>
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
              Sign Up
            </button>
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>

          <p className="mt-6 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--primary)] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}

export default SignUpPage;
