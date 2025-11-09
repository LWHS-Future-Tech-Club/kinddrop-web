'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // store a simple user entry so other pages can read it while we don't have real auth
    try {
      localStorage.setItem('kinddrop_user', JSON.stringify({ email }));
    } catch (err) {
      // ignore
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-glow">KindDrop</span>
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold mb-2 text-glow">Welcome Back</h1>
          <p className="mb-6">Log in to continue spreading brightness</p>

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
              Log In
            </button>
          </form>

          <p className="mt-6 text-center">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[var(--primary)] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
