'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import TopBar from './components/TopBar';
import PageTransition from './components/PageTransition';

export function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messages = [
    // Direct & Simple
    'Leave kindness. Find kindness.',
    'Drop a kind message for someone who needs it.',
    'Share something good today.',
    'Make someone\'s day a little better.',
    'Brighten someone\'s world.',
    // Playful & Light
    'Drop some kindness in the world.',
    'Good vibes only. Pass them on.',
    'Spread kindness like confetti.',
    'Your daily reminder: be kind.',
    'Make the internet a nicer place.',
    // Warm & Personal
    'Someone needs to hear this from you.',
    'Your words matter more than you think.',
    'A little kindness goes a long way.',
    'You never know who needs encouragement today.',
    'Be the bright spot in someone\'s feed.',
    // Minimalist
    'Choose kindness.',
    'Spread kindness.',
    'Share something kind.',
    'Be kind today.',
    'Drop kindness here.',
    // Community-focused
    'Join a community of kindness.',
    'We\'re all in this together.',
    'Build a kinder corner of the internet.',
    'Kindness is contagious. Start here.',
  ];
  const [headline, setHeadline] = useState('Your words could save someone\'s day.');
  const [subheadline, setSubheadline] = useState(
    'Share anonymous encouragement on KindDrop so no one has to feel alone.'
  );
  const [messageIndex, setMessageIndex] = useState(0);

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

  useEffect(() => {
    if (!messages.length) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    setHeadline(messages[messageIndex]);
  }, [messageIndex]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar />

      <PageTransition className="flex-1 flex">
        <main className="flex-1 flex items-center justify-center px-6 pt-10 md:pt-14 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                key={messageIndex}
                className="text-5xl md:text-6xl mb-6 text-glow"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                {headline}
              </motion.h1>

              <p className="max-w-2xl mx-auto text-lg md:text-xl mb-10 opacity-80">
                {subheadline}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link href="/dashboard">
                  <button className="text-lg px-8 py-4 opacity-80 hover:opacity-100 transition-opacity">Send a kind message</button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      {/* Shared footer provided by RootLayout */}
    </div>
  );
}

export default LandingPage;
