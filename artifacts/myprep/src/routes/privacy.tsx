import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-foreground">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p className="font-medium text-primary">Your privacy matters to us</p>
          <p className="mt-1 text-sm text-muted-foreground">This Privacy Policy explains how MyPrep collects, uses, shares, and protects your personal information when you use our platform. We are committed to being transparent about our data practices.</p>
        </div>

        <Section title="1. Information We Collect">
          <SubSection title="Account Information">
            When you register, we collect: your full name, email address, WhatsApp number (optional), country, target exam, and course of interest. This information is used to create and manage your account.
          </SubSection>
          <SubSection title="Usage Data">
            We automatically collect information about how you use the Platform, including: pages visited, features used, exam attempts and scores, time spent on the Platform, questions answered, and device/browser information.
          </SubSection>
          <SubSection title="Communication Data">
            If you contact us, participate in community forums, or sign up for our newsletter, we collect the content of those communications.
          </SubSection>
          <SubSection title="Payment Information">
            For premium subscriptions, payment processing is handled by our authorized payment partners. We do not store complete card details on our servers. We receive transaction confirmation and subscription status information.
          </SubSection>
        </Section>

        <Section title="2. How We Use Your Information">
          <p className="text-muted-foreground mb-3">We use your information to:</p>
          <ul className="space-y-2 pl-5 list-disc text-muted-foreground">
            <li>Provide, operate, and improve the Platform and its features</li>
            <li>Personalize your learning experience and track your progress</li>
            <li>Send you educational updates, study tips, and exam news (you can opt out anytime)</li>
            <li>Process payments and manage subscriptions</li>
            <li>Provide customer support and respond to your inquiries</li>
            <li>Detect, prevent, and address technical issues and fraudulent activity</li>
            <li>Analyze usage trends to improve our services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="3. How We Share Your Information">
          <p className="text-muted-foreground mb-3">We do not sell your personal information. We may share your information with:</p>
          <SubSection title="Service Providers">
            Trusted third-party companies that help us operate the Platform, including cloud hosting (Supabase), payment processors, email service providers, and AI service providers. These partners are contractually obligated to protect your data.
          </SubSection>
          <SubSection title="Legal Requirements">
            We may disclose your information if required by law, court order, or governmental authority, or to protect the rights, property, or safety of MyPrep, our users, or others.
          </SubSection>
          <SubSection title="Business Transfers">
            In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
          </SubSection>
          <SubSection title="With Your Consent">
            We may share your information with third parties when you have given us explicit consent to do so.
          </SubSection>
        </Section>

        <Section title="4. Data Storage and Security">
          <p className="text-muted-foreground">Your data is stored on secure servers provided by Supabase, with data centers that comply with international security standards. We implement appropriate technical and organizational security measures including:</p>
          <ul className="mt-3 space-y-2 pl-5 list-disc text-muted-foreground">
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Encryption of sensitive data at rest</li>
            <li>Row-level security policies on all database tables</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls limiting who can access your data</li>
          </ul>
          <p className="mt-3 text-muted-foreground">While we take strong precautions, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to best practices.</p>
        </Section>

        <Section title="5. Cookies and Tracking">
          <p className="text-muted-foreground">We use cookies and similar tracking technologies to:</p>
          <ul className="mt-2 space-y-2 pl-5 list-disc text-muted-foreground">
            <li>Keep you logged in to your account</li>
            <li>Remember your preferences (such as dark/light mode)</li>
            <li>Analyze Platform usage and performance</li>
          </ul>
          <p className="mt-3 text-muted-foreground">You can control cookies through your browser settings. Disabling cookies may affect some features of the Platform.</p>
        </Section>

        <Section title="6. Your Rights">
          <p className="text-muted-foreground mb-3">You have the following rights regarding your personal information:</p>
          <SubSection title="Access">You can access your personal information through your account profile at any time.</SubSection>
          <SubSection title="Correction">You can update or correct inaccurate information in your account settings.</SubSection>
          <SubSection title="Deletion">You can request deletion of your account and associated data. Note that some data may be retained for legal or legitimate business purposes.</SubSection>
          <SubSection title="Data Portability">You can request a copy of your data in a structured, commonly used format.</SubSection>
          <SubSection title="Opt-out">You can opt out of marketing communications at any time by clicking "unsubscribe" in emails or contacting us directly.</SubSection>
          <p className="mt-3 text-muted-foreground">To exercise these rights, please contact us at privacy@myprep.ng.</p>
        </Section>

        <Section title="7. Children's Privacy">
          <p className="text-muted-foreground">Our Platform is intended for users aged 13 and above. Users between 13 and 18 should have parental consent. We do not knowingly collect personal information from children under 13. If we discover we have inadvertently collected information from a child under 13, we will promptly delete it.</p>
          <p className="mt-2 text-muted-foreground">Parents or guardians who believe their child under 13 has provided us with personal information should contact us at privacy@myprep.ng.</p>
        </Section>

        <Section title="8. Data Retention">
          <p className="text-muted-foreground">We retain your personal information for as long as your account is active or as needed to provide you services. We retain some data for legitimate business purposes such as:</p>
          <ul className="mt-2 space-y-1.5 pl-5 list-disc text-muted-foreground">
            <li>Resolving disputes and enforcing our agreements</li>
            <li>Complying with legal obligations</li>
            <li>Preventing fraud and abuse</li>
          </ul>
        </Section>

        <Section title="9. Third-Party Links">
          <p className="text-muted-foreground">The Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies before providing any personal information.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p className="text-muted-foreground">We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of significant changes by updating the date at the top of this page and, where required, by sending you an email. Continued use of the Platform after changes constitutes acceptance of the updated Policy.</p>
        </Section>

        <Section title="11. Contact Us">
          <p className="text-muted-foreground">If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Data Protection team:</p>
          <div className="mt-3 space-y-1 text-muted-foreground">
            <p><strong className="text-foreground">Email:</strong> privacy@myprep.ng</p>
            <p><strong className="text-foreground">Address:</strong> MyPrep Data Protection Team, Lagos, Nigeria</p>
            <p><strong className="text-foreground">Response time:</strong> We aim to respond to all privacy requests within 30 days.</p>
          </div>
        </Section>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-secondary/30 p-5 text-center">
        <p className="text-sm text-muted-foreground">By using MyPrep, you acknowledge that you have read and understood this Privacy Policy.</p>
        <div className="mt-3 flex justify-center gap-3">
          <Link to="/terms" className="text-sm text-primary hover:underline">Terms &amp; Conditions</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/" className="text-sm text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-muted-foreground">{children}</p>
    </div>
  );
}
