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
      <header className="glass-card mx-6 my-6 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
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
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm">Spread kindness, earn rewards</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-glow">
              Your Daily Dose<br />of Brightness
            </h1>

            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Send messages of encouragement and positivity to brighten someone's day.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/dashboard">
                <button className="btn-outline text-lg px-8 py-4">Get Started Free</button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-8 max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-2xl p-6 border border-purple-500/30">
                <p className="text-lg italic">
                  You are capable of amazing things! Keep pushing forward and believe in yourself. 💫
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-glow">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Send className="w-8 h-8" />, title: 'Send Brightness', desc: 'Share encouraging messages' },
              { icon: <Sparkles className="w-8 h-8" />, title: 'Earn Points', desc: 'Get 10 points per message' },
              { icon: <Heart className="w-8 h-8" />, title: 'Make an Impact', desc: 'Join a community of kindness' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center hover:scale-105 transition-transform duration-200"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-glow">{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="glass-card mx-6 mb-6 px-8 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <span>© 2025 KindDrop. Made with ❤️ for spreading kindness.</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
