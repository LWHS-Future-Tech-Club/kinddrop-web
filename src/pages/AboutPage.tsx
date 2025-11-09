'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export function AboutPage() {
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
            <Link href="/"><button className="px-6 py-2 hover:text-white transition-colors">Home</button></Link>
            <Link href="/signup"><button className="btn-glow">Sign Up</button></Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-20">
        <div className="max-w-4xl mx-auto glass-card p-12">
          <h1 className="text-5xl font-bold mb-8 text-glow">About KindDrop</h1>
          <p className="text-xl mb-6">We believe in the power of small acts of kindness to create meaningful change in the world.</p>
          <p className="text-xl">Every message counts. We help you track and celebrate your positive impact on others.</p>
        </div>
      </main>

      <footer className="glass-card mx-6 mb-6 px-8 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <span>© 2025 KindDrop. Made with ❤️ for spreading kindness.</span>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
