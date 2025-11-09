"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, LogOut } from 'lucide-react';

export default function SampleDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kinddrop_user');
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('kinddrop_user');
    } catch (err) {}
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-glow">KindDrop</div>
              <div className="text-sm text-[var(--text-muted)]">Sample Dashboard</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user?.email ? (
              <div className="text-sm text-[var(--text-muted)]">Signed in as <span className="font-medium text-white">{user.email}</span></div>
            ) : (
              <div className="text-sm text-[var(--text-muted)]">Not signed in</div>
            )}

            <button onClick={handleLogout} className="btn-glow px-3 py-1">
              <LogOut className="w-4 h-4 mr-2 inline" />
              Logout
            </button>
          </div>
        </header>

        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold mb-2 text-glow">Welcome{user?.email ? `, ${user.email}` : ''}!</h1>
          <p className="mb-4">This is a sample dashboard while authentication is not implemented. You can sign up or log in with any email and password.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">Points<br/><span className="font-bold text-xl">120</span></div>
            <div className="p-4 bg-white/5 rounded-lg">Messages<br/><span className="font-bold text-xl">4</span></div>
            <div className="p-4 bg-white/5 rounded-lg">Profile<br/><span className="font-bold text-xl">Basic</span></div>
          </div>

          <div className="mt-6">
            <Link href="/" className="btn-glow">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
