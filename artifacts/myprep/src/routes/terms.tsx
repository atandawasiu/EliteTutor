import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Terms &amp; Conditions</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground">
        <Section title="1. Acceptance of Terms">
          <p>By accessing or using Elite Tutor ("the Platform", "we", "our", "us"), you agree to be bound by these Terms &amp; Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our Platform.</p>
          <p>These terms apply to all visitors, users, students, and any other persons who access or use our services.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>Elite Tutor is Africa's leading exam preparation platform providing:</p>
          <ul>
            <li>Computer-Based Test (CBT) practice for JAMB, WAEC, NECO, IELTS, SAT, GRE and other examinations</li>
            <li>AI-powered explanations and study assistance</li>
            <li>Question banks, study materials and past papers</li>
            <li>School and institution information database</li>
            <li>Academic tools including score calculators</li>
            <li>Community discussion forums</li>
            <li>Study progress tracking and analytics</li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p><strong>Registration:</strong> To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
          <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify Elite Tutor of any unauthorized use of your account.</p>
          <p><strong>Age Requirement:</strong> Users must be at least 13 years old. Users between 13 and 18 must have parental consent. By registering, you represent that you meet these requirements.</p>
          <p><strong>One Account Per User:</strong> Each person may maintain only one active account. Creating multiple accounts may result in termination of all accounts.</p>
        </Section>

        <Section title="4. User Conduct">
          <p>You agree not to:</p>
          <ul>
            <li>Reproduce, distribute, modify, or create derivative works from any content on the Platform without our express written consent</li>
            <li>Use the Platform for any unlawful purpose or in violation of these Terms</li>
            <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
            <li>Attempt to gain unauthorized access to any part of the Platform or its related systems</li>
            <li>Use automated means to scrape, crawl, or collect data from the Platform</li>
            <li>Share account credentials or allow others to access your account</li>
            <li>Engage in any activity that interferes with or disrupts the Platform</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </Section>

        <Section title="5. Subscription Plans and Payments">
          <p><strong>Free Plan:</strong> The free plan provides limited access to questions, practice sessions, and features as specified on our pricing page.</p>
          <p><strong>Premium Plan:</strong> Premium subscriptions provide full access to all features, unlimited practice questions, AI assistance, and priority support.</p>
          <p><strong>Payment:</strong> All subscription fees are charged in Nigerian Naira (NGN) unless otherwise stated. Payments are processed through our authorized payment partners.</p>
          <p><strong>Refunds:</strong> We offer a 7-day refund policy for new premium subscriptions if you are not satisfied. Refund requests after this period will be considered on a case-by-case basis.</p>
          <p><strong>Cancellation:</strong> You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>All content on the Platform, including but not limited to text, graphics, logos, images, audio clips, video clips, question banks, and software, is the property of Elite Tutor or its content suppliers and is protected by Nigerian and international intellectual property laws.</p>
          <p>Past examination questions may be sourced from publicly available materials and examination bodies including JAMB, WAEC, NECO, and others. We respect the intellectual property rights of these organizations.</p>
          <p>User-generated content (community posts, discussions) remains the property of the respective users. By posting content, you grant Elite Tutor a non-exclusive, royalty-free license to use, display, and distribute such content on the Platform.</p>
        </Section>

        <Section title="7. AI-Powered Features">
          <p>Elite Tutor uses artificial intelligence to provide explanations, study assistance, and personalized learning recommendations. Please note:</p>
          <ul>
            <li>AI-generated content is for educational assistance only and should not be taken as definitive answers</li>
            <li>Always verify important information with official sources and qualified educators</li>
            <li>AI responses may occasionally contain errors or inaccuracies</li>
            <li>We continuously improve our AI systems but cannot guarantee perfect accuracy</li>
          </ul>
        </Section>

        <Section title="8. Privacy">
          <p>Your privacy is important to us. Our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using the Platform, you consent to the practices described in our Privacy Policy.</p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. Elite Tutor does not warrant that:</p>
          <ul>
            <li>The Platform will be uninterrupted, secure, or error-free</li>
            <li>Results obtained from using the Platform will be accurate or reliable</li>
            <li>Questions and content perfectly match actual examination content</li>
            <li>The Platform will meet your specific requirements</li>
          </ul>
          <p>Past performance in practice tests does not guarantee similar results in actual examinations.</p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>To the maximum extent permitted by applicable law, Elite Tutor shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of the Platform.</p>
          <p>Our total liability to you for any claim arising from these Terms or your use of the Platform shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>
        </Section>

        <Section title="11. Modifications to Terms">
          <p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "Last updated" date at the top of this page and, where appropriate, sending an email notification.</p>
          <p>Continued use of the Platform after changes constitutes acceptance of the modified Terms.</p>
        </Section>

        <Section title="12. Termination">
          <p>We reserve the right to suspend or terminate your account at our discretion, including for violation of these Terms. You may also delete your account at any time through your profile settings.</p>
          <p>Upon termination, your right to use the Platform will immediately cease. Sections of these Terms that by their nature should survive termination will do so.</p>
        </Section>

        <Section title="13. Governing Law">
          <p>These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Nigeria.</p>
        </Section>

        <Section title="14. Contact Us">
          <p>If you have questions about these Terms, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> legal@elitetutor.ng</li>
            <li><strong>Address:</strong> Elite Tutor, Lagos, Nigeria</li>
          </ul>
        </Section>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-secondary/30 p-5 text-center">
        <p className="text-sm text-muted-foreground">By using Elite Tutor, you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions.</p>
        <div className="mt-3 flex justify-center gap-3">
          <Link to="/privacy" className="text-sm text-primary hover:underline">Privacy Policy</Link>
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
      <h2 className="mb-3 font-display text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground [&_strong]:text-foreground [&_a]:text-primary [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:list-disc">
        {children}
      </div>
    </div>
  );
}
