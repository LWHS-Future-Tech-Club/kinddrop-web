'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-header mx-6 my-6 px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="KindDrop" width={74} height={74} className="rounded-full" />
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
          <p className="text-xl mb-6">Every message counts. We help you track and celebrate your positive impact on others.</p>

          <h2 className="text-3xl font-semibold mt-8 mb-4">Credits</h2>
          <ul className="text-xl space-y-2">
            <li><span className="font-semibold">Front End:</span> Aaron Chen</li>
            <li><span className="font-semibold">Back End:</span> Rudy Pandit</li>
            <li><span className="font-semibold">Misc:</span> Sathvik, Chris, Arya, Ryan</li>
          </ul>
        </div>
      </main>

      
    </div>
  );
}

