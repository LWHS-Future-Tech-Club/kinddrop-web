
'use client';
import React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

export function SignUpPage() {


  const router = useRouter();
  const [email, setEmail] = useState('');
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
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#8000FF'}}>
            <Heart className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-glow">KindDrop</span>
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold mb-2 text-glow">Create Account</h1>
          <p className="mb-6">Join us in spreading kindness</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass w-full"
                placeholder="you@example.com"
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
    </div>
  );
}

export default SignUpPage;
