"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Sparkles, Sun } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../components/ui/button';

export  function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; username?: string; points?: number; profileImage?: string; hasRegeneratedUsername?: boolean; ipAddress?: string; accountType?: string } | null>(null);
  const [suggestedUsername, setSuggestedUsername] = useState<string | null>(null);
  const [showUsernameConfirm, setShowUsernameConfirm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kinddrop_user');
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      setUser(null);
    }
    // Load server user for profile image
    (async () => {
      try {
        const res = await fetch('/api/get-user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(prev => ({ ...prev, ...data.user }));
        }
      } catch {}
    })();
  }, []);

  const regenerateAvatar = async () => {
    try {
      const res = await fetch('/api/regenerate-avatar', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, profileImage: data.profileImage }));
      }
    } catch {}
  };

  const generateNewUsername = async () => {
    try {
      const res = await fetch('/api/regenerate-username', { method: 'GET', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSuggestedUsername(data.newUsername);
        setShowUsernameConfirm(true);
      }
    } catch {}
  };

  const acceptNewUsername = async () => {
    if (!suggestedUsername) return;
    try {
      const res = await fetch('/api/regenerate-username', { 
        method: 'POST', 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername: suggestedUsername })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, username: data.username, hasRegeneratedUsername: true }));
        setShowUsernameConfirm(false);
        setSuggestedUsername(null);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update username');
      }
    } catch {}
  };

  const keepCurrentUsername = () => {
    setShowUsernameConfirm(false);
    setSuggestedUsername(null);
  };

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
            <Image src="/logo.png" alt="KindDrop" width={74} height={74} className="rounded-full" />
            <span className="text-2xl font-bold text-glow">KindDrop</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-bold">{user?.points ?? 0}</span>
              <span className="text-sm">karma</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="btn-outline flex items-center gap-2 px-3 py-1">
                  <Sun className="w-4 h-4 mr-2" />
                  Dashboard
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
            <h1 className="text-2xl font-bold mb-2 text-glow">Welcome{user?.username ? `, ${user.username}` : ''}!</h1>
            <p className="mb-4">Manage your profile settings below.</p>
            
            {/* Account Info Section */}
            <div className="mb-6 p-3 bg-white/5 rounded-lg">
              <h2 className="text-base font-bold mb-2">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-white/50">Email</span>
                  <p className="font-mono text-xs text-white/80">{user?.email || 'Loading...'}</p>
                </div>
                <div>
                  <span className="text-xs text-white/50">IP Address</span>
                  <p className="font-mono text-xs text-white/80">{user?.ipAddress || 'Loading...'}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-lg flex flex-col items-center">
                <span className="mb-2">Profile Picture</span>
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full border border-white/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/10" />
                )}
                <button onClick={regenerateAvatar} className="btn-outline mt-3 px-3 py-1">Regenerate</button>
              </div>
              <div className="p-4 bg-white/5 rounded-lg flex flex-col items-center">
                <span className="mb-2">Username</span>
                <span className="font-bold text-xl mb-2">{user?.username || 'Friend'}</span>
                {!user?.hasRegeneratedUsername && (
                  <button onClick={generateNewUsername} className="btn-outline mt-2 px-3 py-1">Regenerate</button>
                )}
                {user?.hasRegeneratedUsername && (
                  <span className="text-xs text-white/40 mt-2">Already regenerated</span>
                )}
              </div>
              <div className="p-4 bg-white/5 rounded-lg flex flex-col items-center">
                <span className="mb-2">Account Type</span>
                <span className="font-bold text-xl mb-2 capitalize">{user?.accountType || 'Regular'}</span>
              </div>
            </div>
            
            {showUsernameConfirm && suggestedUsername && (
              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-purple-500/30">
                <p className="mb-3">New username: <span className="font-bold text-purple-300">{suggestedUsername}</span></p>
                <div className="flex gap-3">
                  <button onClick={acceptNewUsername} className="btn-glow px-4 py-2">Accept</button>
                  <button onClick={keepCurrentUsername} className="btn-outline px-4 py-2">Keep Current</button>
                </div>
              </div>
            )}
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