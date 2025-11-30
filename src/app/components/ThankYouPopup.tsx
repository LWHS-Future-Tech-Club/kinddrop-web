"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThankYouPopupProps {
  show: boolean;
  pointsAdded?: number;
  onClose?: () => void;
}

export default function ThankYouPopup({ show, pointsAdded = 10, onClose }: ThankYouPopupProps) {
  useEffect(() => {
    if (!show) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Backdrop (click to close) */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#2d1b4e] to-[#3d2b5e] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.96 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={() => onClose?.()}
          />

          {/* Decorative curved top - using SVG */}
          <svg className="absolute top-0 left-0 w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,120 C220,20 420,20 720,100 C1020,180 1220,60 1440,80 L1440,0 L0,0 Z" fill="#4b2e7a" opacity="0.18" />
          </svg>

          {/* Content */}
          <motion.div
            className="relative z-10 max-w-2xl w-full text-center text-white px-6"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-8 py-10 md:py-14 rounded-2xl">
              <h1 className="text-4xl md:text-5xl font-[Instrument Serif] font-normal">Thank you!</h1>
              <p className="mt-4 text-lg md:text-xl italic text-gray-200">Your message has been sent.</p>

              <div className="mt-8">
                <motion.div
                  className="inline-flex items-center gap-3 bg-white/6 px-6 py-3 rounded-xl"
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -6, opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <span className="text-2xl font-semibold">+{pointsAdded}</span>
                  <span className="text-sm text-gray-200">points</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
