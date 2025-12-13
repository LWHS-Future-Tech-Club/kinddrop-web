"use client";

import TopBar from "@/app/components/TopBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import PageTransition from "@/app/components/PageTransition";

export default function PoliciesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      <PageTransition className="flex-1 flex">
        <main className="flex-1 px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-12 rounded-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-glow mb-6">Policies</h1>
              <p className="text-lg md:text-xl mb-8 text-white/85">
                We care deeply about privacy, safety, and respectful use. Below is a simplified summary; detailed policies will be published soon.
              </p>

              <div className="rounded-2xl mb-8">
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

              <section className="">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Contact</h2>
                <p className="text-lg md:text-xl text-white/80">
                  Questions or concerns? Please reach out via the Future Tech Club channels.
                </p>
              </section>
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
