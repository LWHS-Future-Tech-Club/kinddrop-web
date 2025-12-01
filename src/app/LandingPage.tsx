'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messages = [
    'Small acts make big waves.',
    'A kind word can change a day.',
    'Leave a little sparkle wherever you go.',
    'Kindness is a superpower—share it.',
    'Be the reason someone smiles today.',
    'Your presence makes this brighter.',
    'One message can lift a heart.',
    'Choose kindness, always.',
  ];
  const [headline, setHeadline] = useState(messages[0]);

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
    // Pick a random message on each page load
    try {
      const idx = Math.floor(Math.random() * messages.length);
      setHeadline(messages[idx]);
    } catch {}
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'kinddrop_user') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-header mx-6 my-6 px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="KindDrop" width={74} height={74} className="rounded-full" />
            <span className="text-2xl font-bold text-glow">KindDrop</span>
          </Link>

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
                  <button className="px-6 py-2 text-[var(--text-lavender)] hover:text-white transition-colors">
                    Log In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="btn-glow">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl mb-6 text-glow">
              {headline}
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/dashboard">
                <button className="btn-outline text-lg px-8 py-4">Start Spreading 
                 Kindness</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Shared footer provided by RootLayout */}
    </div>
  );
}

export default LandingPage;
