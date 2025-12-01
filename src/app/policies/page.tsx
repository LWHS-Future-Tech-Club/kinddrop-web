"use client";

import Link from "next/link";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";

export default function PoliciesPage() {
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
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-glow mb-4">Policies</h1>
        <p className="text-white/80 mb-6">
          We care deeply about privacy, safety, and respectful use. Below is a simplified summary; detailed policies will be published soon.
        </p>

        <div className="glass-card p-6 rounded-2xl mb-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="privacy">
              <AccordionTrigger className="text-xl">Privacy Policy</AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed text-white/80">
                We collect only what's needed to operate KindDrop: account info (like email), messages you send/receive, and basic activity to prevent abuse.
                We do not sell your data. Access is restricted and used solely to provide the service, improve reliability, and ensure safety.
                Messages are stored to enable matching. We do not publicly reveal your email; recipients only see the sender email to support accountability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="terms">
              <AccordionTrigger className="text-xl">Terms of Service</AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed text-white/80">
                Be kind and lawful. Do not post harmful, hateful, racist, sexist, lewd, or violent content. You agree to the daily message limits and community rules.
                Violations may result in content removal or account restrictions. The service is provided as-is without guarantees; use at your own discretion.
                To promote thoughtful sharing, you can send one message and receive one message per day. Limits reset at midnight PST.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-6">
          <section className="glass-card p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-2">Contact</h2>
            <p className="text-white/80">
              Questions or concerns? Please reach out via the Future Tech Club channels.
            </p>
          </section>
        </div>
        </div>
      </main>

      <footer className="glass-card mx-6 mb-6 px-8 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <span>© 2025 Future Tech Club</span>
        </div>
      </footer>
    </div>
  );
}
