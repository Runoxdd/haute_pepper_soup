import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Haute Pepper Soup collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="px-6 pb-24 pt-8 sm:pt-12">
      <article className="prose dark:prose-invert mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Last updated: March 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-600 dark:text-[rgba(255,255,255,0.7)]">
          {/* Introduction */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              1. Introduction
            </h2>
            <p>
              Haute Pepper Soup (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
              &ldquo;us&rdquo;) is committed to protecting your personal data.
              This Privacy Policy explains what information we collect when you
              use our website and ordering service, how we use it, and your
              rights under the Nigeria Data Protection Act 2023 (NDPA).
            </p>
          </section>

          {/* Data collected */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect the following information when you place an order or
              create an account:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-text-primary">Contact information:</strong>{" "}
                Name, phone number, and email address (if provided).
              </li>
              <li>
                <strong className="text-text-primary">Delivery information:</strong>{" "}
                Delivery address and any special instructions.
              </li>
              <li>
                <strong className="text-text-primary">Order details:</strong> Items
                ordered, quantities, prices, and order reference numbers.
              </li>
              <li>
                <strong className="text-text-primary">Account information:</strong> If
                you sign in via Google, Apple, or Facebook, we receive your name,
                email, and profile picture from the OAuth provider. We do not
                store your passwords.
              </li>
              <li>
                <strong className="text-text-primary">Usage data:</strong> Anonymous
                analytics data including pages visited and device type, collected
                via PostHog.
              </li>
            </ul>
          </section>

          {/* Purpose */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-text-primary">Order fulfillment:</strong> To
                process your order, arrange delivery, and contact you regarding
                your purchase.
              </li>
              <li>
                <strong className="text-text-primary">Communication:</strong> To send
                order confirmations and respond to your inquiries via email or
                WhatsApp.
              </li>
              <li>
                <strong className="text-text-primary">Service improvement:</strong> To
                understand how our service is used and improve the experience.
              </li>
              <li>
                <strong className="text-text-primary">Legal compliance:</strong> To
                comply with applicable laws and regulations.
              </li>
            </ul>
          </section>

          {/* Storage */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              4. Data Storage and Security
            </h2>
            <p>
              Your data is stored securely in MongoDB Atlas, a cloud database
              with encryption at rest and in transit. We use HTTPS for all
              communications and follow industry-standard security practices.
              Access to customer data is restricted to authorised personnel only.
            </p>
            <p className="mt-3">
              We retain your order data for as long as necessary to fulfill the
              purposes described in this policy, or as required by law. You may
              request deletion of your data at any time.
            </p>
          </section>

          {/* Sharing */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              5. Data Sharing
            </h2>
            <p>
              We do not sell your personal data. We may share limited data with
              the following service providers who help us operate our business:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-text-primary">Resend:</strong> Email delivery
                for order notifications.
              </li>
              <li>
                <strong className="text-text-primary">PostHog:</strong> Anonymous usage
                analytics.
              </li>
              <li>
                <strong className="text-text-primary">Sentry:</strong> Error tracking
                to maintain service reliability.
              </li>
            </ul>
            <p className="mt-3">
              These providers process data solely on our behalf and under
              contractual obligations to protect your privacy.
            </p>
          </section>

          {/* NDPA compliance */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              6. Your Rights (NDPA 2023)
            </h2>
            <p className="mb-3">
              Under the Nigeria Data Protection Act 2023, you have the right to:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-text-primary">Access:</strong> Request a copy
                of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-text-primary">Rectification:</strong> Request
                correction of inaccurate personal data.
              </li>
              <li>
                <strong className="text-text-primary">Erasure:</strong> Request
                deletion of your personal data.
              </li>
              <li>
                <strong className="text-text-primary">Data portability:</strong>{" "}
                Request your data in a structured, machine-readable format.
              </li>
              <li>
                <strong className="text-text-primary">Object to processing:</strong>{" "}
                Object to certain types of data processing.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us via WhatsApp or
              email. We will respond to your request within 30 days.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              7. Cookies
            </h2>
            <p>
              We use essential cookies for authentication and session management.
              Analytics cookies from PostHog are used to understand usage
              patterns. No advertising cookies are used. You can manage cookie
              preferences in your browser settings.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date. We
              encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              9. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or wish to
              exercise your data protection rights, please contact us via
              WhatsApp or send an email to the address provided on our website.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
