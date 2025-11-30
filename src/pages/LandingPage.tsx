'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Send, Sparkles } from 'lucide-react';

export function LandingPage() {
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#8000FF'}}>
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-glow">KindDrop</span>
          </Link>

          <div className="flex items-center gap-4">
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
            <h1 className="text-6xl md:text-7xl mb-6 text-glow">
              I'm so glad you're here.
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/dashboard">
                <button className="btn-outline text-lg px-8 py-4">Create a free account</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="mx-6 mb-6 px-8 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <span>© 2025 KindDrop. Made with ❤️ for spreading kindness.</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
