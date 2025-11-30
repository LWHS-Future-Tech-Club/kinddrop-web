"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, LogOut, Sparkles, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';

export  function SettingsPage() {
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

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {}
    try {
      localStorage.removeItem('kinddrop_user');
    } catch (storageErr) {}
    router.push('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header - matches dashboard */}
      <header className="glass-header mx-6 my-6 px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8000FF' }}>
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-glow">KindDrop</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-bold">120</span>
              <span className="text-sm">points</span>
            </div>
            <div className="flex items-center gap-4">
              {user?.email ? (
                <div className="text-sm text-[var(--text-muted)]">Signed in as <span className="font-medium text-white">{user.email}</span></div>
              ) : (
                <div className="text-sm text-[var(--text-muted)]">Not signed in</div>
              )}
              <Link href="/settings">
                <button className="btn-outline flex items-center gap-2 px-3 py-1">
                  <Sun className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <div className="glass-card p-8">
            <h1 className="text-2xl font-bold mb-2 text-glow">Welcome{user?.email ? `, ${user.email}` : ''}!</h1>
            <p className="mb-4">This is a sample dashboard while authentication is not implemented. You can sign up or log in with any email and password.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">Points<br /><span className="font-bold text-xl">120</span></div>
              <div className="p-4 bg-white/5 rounded-lg">Messages<br /><span className="font-bold text-xl">4</span></div>
              <div className="p-4 bg-white/5 rounded-lg">Profile<br /><span className="font-bold text-xl">Basic</span></div>
            </div>
            <div className="mt-6">
              <Link href="/dashboard" className="btn-glow">
                Back to messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default SettingsPage;