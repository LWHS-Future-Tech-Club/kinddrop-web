'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function TopBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('kinddrop_user') : null;
        setIsLoggedIn(!!stored);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'kinddrop_user') checkAuth();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <header className="glass-header mx-6 my-6 px-8 py-4">
      <div className="flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          <Link href="/about" className="px-2 py-2 text-[var(--text-lavender)] hover:text-white transition-colors">
            About
          </Link>
          <Link href="/policies" className="px-2 py-2 text-[var(--text-lavender)] hover:text-white transition-colors">
            Policies
          </Link>
          {isLoggedIn ? (
            <Link href="/dashboard">
              <button className="btn-glow">Dashboard</button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button className="px-6 py-2 text-[var(--text-lavender)] hover:text-white transition-colors">Log In</button>
              </Link>
              <Link href="/signup">
                <button className="btn-glow">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
