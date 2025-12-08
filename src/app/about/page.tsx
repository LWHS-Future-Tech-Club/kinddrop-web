'use client';

import TopBar from '@/app/components/TopBar';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 rounded-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-glow">About KindDrop</h1>
            <p className="text-lg md:text-xl mb-4 text-white/85">We believe in the power of small acts of kindness to create meaningful change in the world.</p>
            <p className="text-lg md:text-xl mb-8 text-white/85">Every message counts. We help you track and celebrate your positive impact on others.</p>

            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Credits</h2>
            <ul className="text-lg md:text-xl space-y-2">
              <li><span className="font-semibold">Front End:</span> Aaron Chen</li>
              <li><span className="font-semibold">Back End:</span> Rudy Pandit</li>
              <li><span className="font-semibold">Misc:</span> Sathvik, Chris, Arya, Ryan</li>
            </ul>
          </div>
        </div>
      </main>

      
    </div>
  );
}

