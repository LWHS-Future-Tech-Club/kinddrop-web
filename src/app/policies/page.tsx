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
                Terms and Privacy for Kind Drop (operated by Future Tech Club).
              </p>

              <div className="rounded-2xl mb-8">
                <Accordion type="single" collapsible>
                  <AccordionItem value="terms">
                    <AccordionTrigger className="text-xl">Terms and Conditions</AccordionTrigger>
                    <AccordionContent className="text-lg leading-relaxed text-white/80 space-y-4">
                      <p>Terms and Conditions for Kind Drop</p>
                      <p>Please read these terms and conditions ("terms and conditions", "terms") carefully before using the Kind Drop mobile application ("app", "service") operated by Future Tech Club ("us", "we", "our").</p>
                      <h3 className="text-xl font-semibold mt-4">Conditions of use</h3>
                      <p>By using this app, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to stop using the app accordingly. Future Tech Club only grants use and access of this app, its products, and its services to those who have accepted its terms.</p>
                      <h3 className="text-xl font-semibold mt-4">Privacy policy</h3>
                      <p>Before you continue using our app, we advise you to read our privacy policy. It will help you better understand our practices.</p>
                      <h3 className="text-xl font-semibold mt-4">Prohibited Content</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Contains inappropriate, offensive, or explicit material including but not limited to sexual content, graphic violence, or hate speech</li>
                        <li>Harasses, threatens, or bullies other users</li>
                        <li>Promotes illegal activities or violence</li>
                        <li>Contains personal information of others without their consent</li>
                        <li>Infringes on intellectual property rights</li>
                        <li>Contains spam, malware, or malicious code</li>
                        <li>Impersonates another person or entity</li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-4">System Integrity</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Attempt to bypass, disable, or manipulate our automated content moderation filters or safety systems</li>
                        <li>Use automated tools, bots, or scripts to access or interact with the app</li>
                        <li>Attempt to gain unauthorized access to other user accounts or the app's systems</li>
                        <li>Exploit bugs or vulnerabilities for any purpose</li>
                        <li>Reverse engineer or attempt to extract source code from the app</li>
                      </ul>
                      <p className="mt-2">Violations of these policies may result in content removal, temporary account suspension, or permanent account termination.</p>
                      <h3 className="text-xl font-semibold mt-4">Age restriction</h3>
                      <p>You must be at least 13 years of age before you can use this app. By using this app, you warrant that you are at least 13 years of age and you may legally adhere to this Agreement. Future Tech Club assumes no responsibility for liabilities related to age misrepresentation.</p>
                      <h3 className="text-xl font-semibold mt-4">Intellectual property</h3>
                      <p>You agree that all materials, products, and services provided on this app are the property of Future Tech Club and its licensors. You also agree not to reproduce or redistribute the intellectual property in any way.</p>
                      <p>You grant Future Tech Club a royalty-free and non-exclusive license to display, use, copy, transmit, and broadcast the content you upload and publish.</p>
                      <h3 className="text-xl font-semibold mt-4">User accounts</h3>
                      <p>You are responsible for the accuracy of your information and for maintaining the security of your account and password. Inform us immediately of any possible issues regarding your account security.</p>
                      <h3 className="text-xl font-semibold mt-4">Applicable law</h3>
                      <p>By using this app, you agree that the laws of Washington, United States, without regard to conflict of laws principles, will govern these terms and conditions.</p>
                      <h3 className="text-xl font-semibold mt-4">Disputes</h3>
                      <p>Any dispute related in any way to your use of this app shall be arbitrated by state or federal court in Washington, and you consent to exclusive jurisdiction and venue of such courts.</p>
                      <h3 className="text-xl font-semibold mt-4">Indemnification</h3>
                      <p>You agree to indemnify Future Tech Club and its affiliates and hold Future Tech Club harmless against legal claims and demands that may arise from your use or misuse of our services.</p>
                      <h3 className="text-xl font-semibold mt-4">Limitation on liability</h3>
                      <p>Future Tech Club is not liable for any damages that may occur to you as a result of your misuse of our app.</p>
                      <p className="mt-2">Future Tech Club reserves the right to edit, modify, and change this Agreement at any time. We shall let our users know of these changes through electronic mail. This Agreement supersedes and replaces all prior agreements regarding the use of this app.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="privacy">
                    <AccordionTrigger className="text-xl">Privacy Policy</AccordionTrigger>
                    <AccordionContent className="text-lg leading-relaxed text-white/80 space-y-4">
                      <p>Privacy Policy for Kind Drop</p>
                      <p>Effective Date: 12/15/2025</p>
                      <p>Last Updated: 12/7/2025</p>
                      <p>Future Tech Club ("us", "we", or "our") operates Kind Drop (the "App"). This policy explains our collection, use, and disclosure of personal information.</p>
                      <h3 className="text-xl font-semibold mt-4">Information We Collect</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Account Info: Username and password (stored as a secure hash)</li>
                        <li>Message Content: The messages you send and receive</li>
                        <li>Profile Picture: If you upload one</li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-4">How We Use Your Information</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Operate the service (authentication, matching, messaging)</li>
                        <li>Maintain safety and integrity (abuse prevention, moderation)</li>
                        <li>Improve reliability and user experience</li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-4">Legal Basis (GDPR)</h3>
                      <p>Consent, legitimate interests, legal compliance, or contract fulfillment.</p>
                      <h3 className="text-xl font-semibold mt-4">Data Retention</h3>
                      <p>We retain personal information only as long as necessary to meet the purposes outlined and legal obligations.</p>
                      <h3 className="text-xl font-semibold mt-4">Data Sharing and Disclosure</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Service Providers: Bound by confidentiality</li>
                        <li>Business Transfers: With notice</li>
                        <li>Legal Requirements: When required by law</li>
                        <li>With Your Consent</li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-4">Third-Party Services</h3>
                      <p>Links to external services are not controlled by us; review their privacy policies.</p>
                      <h3 className="text-xl font-semibold mt-4">Data Security</h3>
                      <p>We implement safeguards but cannot guarantee absolute security.</p>
                      <h3 className="text-xl font-semibold mt-4">Your Rights</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Access and Portability</li>
                        <li>Correction</li>
                        <li>Deletion</li>
                        <li>Restriction</li>
                        <li>Objection</li>
                        <li>Withdraw Consent</li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-4">California Privacy Rights (CCPA)</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Right to know, access, deletion</li>
                        <li>Right to opt out of sale</li>
                        <li>Equal service and price</li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-4">International Transfers</h3>
                      <p>Your information may be processed in other jurisdictions with appropriate safeguards.</p>
                      <h3 className="text-xl font-semibold mt-4">Push Notifications</h3>
                      <p>You can opt out via device settings.</p>
                      <h3 className="text-xl font-semibold mt-4">Changes to This Policy</h3>
                      <p>We may update this policy and will post changes with an updated "Last Updated" date.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <section className="">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Contact</h2>
                <p className="text-lg md:text-xl text-white/80">
                  Questions or concerns? Please reach out via the Future Tech Club.
                </p>
              </section>
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
