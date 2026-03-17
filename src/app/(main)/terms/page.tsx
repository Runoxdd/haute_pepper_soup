import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for ordering from Haute Pepper Soup.",
};

export default function TermsPage() {
  return (
    <div className="px-6 pb-24 pt-8 sm:pt-12">
      <article className="prose dark:prose-invert mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Last updated: March 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-600 dark:text-[rgba(255,255,255,0.7)]">
          {/* Agreement */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or placing an order through the Haute Pepper Soup
              website (&ldquo;Service&rdquo;), you agree to be bound by these
              Terms of Service. If you do not agree with any part of these terms,
              please do not use our Service.
            </p>
          </section>

          {/* Service description */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              2. Our Service
            </h2>
            <p>
              Haute Pepper Soup operates an order-to-contact food delivery
              service based in Lagos, Nigeria. Customers browse our menu, select
              items, and submit an order. We then contact you via WhatsApp or
              phone to confirm your order, arrange payment, and coordinate
              delivery.
            </p>
            <p className="mt-3">
              We do not process payments online. All payment is arranged
              directly between you and Haute Pepper Soup after your order is
              placed.
            </p>
          </section>

          {/* Ordering */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              3. Ordering
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                You must provide accurate contact information (name, phone
                number, and delivery address) when placing an order.
              </li>
              <li>
                Order confirmation is not a guarantee of availability. We reserve
                the right to decline or cancel orders due to ingredient
                availability, delivery constraints, or other operational reasons.
              </li>
              <li>
                Prices displayed on the menu are in Nigerian Naira (NGN) and are
                subject to change without notice. The price at the time of your
                order submission applies to that order.
              </li>
              <li>
                A unique reference number (e.g., HP-12345) is generated for each
                order. Please retain this for your records.
              </li>
            </ul>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              4. Delivery
            </h2>
            <p>
              Delivery times are estimates and may vary depending on order
              volume, preparation time, and your location. We will communicate
              expected delivery times when we contact you to confirm your order.
            </p>
            <p className="mt-3">
              Delivery areas and fees (if applicable) are determined at the time
              of order confirmation. We currently serve select areas within
              Lagos.
            </p>
          </section>

          {/* Payment */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              5. Payment
            </h2>
            <p>
              Payment is arranged directly with Haute Pepper Soup after your
              order is confirmed. Accepted payment methods will be communicated
              when we contact you. Payment must be completed before or upon
              delivery as agreed.
            </p>
          </section>

          {/* Cancellations */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              6. Cancellations and Refunds
            </h2>
            <p>
              You may cancel your order by contacting us on WhatsApp before we
              begin preparation. Once preparation has started, cancellations may
              not be possible.
            </p>
            <p className="mt-3">
              If you are unsatisfied with your order due to a quality issue on
              our part, please contact us within 2 hours of delivery and we will
              work to resolve the matter.
            </p>
          </section>

          {/* Food safety */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              7. Food Safety and Allergies
            </h2>
            <p>
              Our dishes may contain allergens including but not limited to fish,
              shellfish, nuts, and spices. If you have specific dietary
              requirements or allergies, please inform us when we contact you to
              confirm your order.
            </p>
            <p className="mt-3">
              Pepper soup is a spicy dish by nature. We recommend exercising
              caution if you have a low tolerance for spicy food.
            </p>
          </section>

          {/* Accounts */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              8. User Accounts
            </h2>
            <p>
              You may optionally create an account using Google, Apple, or
              Facebook sign-in to track your order history. Guest ordering is
              also available. You are responsible for maintaining the
              confidentiality of your account access.
            </p>
          </section>

          {/* Intellectual property */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              9. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, images, logos, and
              design, is the property of Haute Pepper Soup and is protected by
              applicable intellectual property laws. You may not reproduce,
              distribute, or use any content without our written permission.
            </p>
          </section>

          {/* Limitation of liability */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              10. Limitation of Liability
            </h2>
            <p>
              Haute Pepper Soup shall not be liable for any indirect,
              incidental, or consequential damages arising from the use of our
              Service. Our total liability shall not exceed the amount paid for
              the specific order giving rise to the claim.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              11. Changes to These Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Changes
              will be posted on this page with an updated revision date.
              Continued use of the Service after changes are posted constitutes
              acceptance of the revised terms.
            </p>
          </section>

          {/* Governing law */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              12. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance
              with the laws of the Federal Republic of Nigeria. Any disputes
              arising from these terms shall be subject to the exclusive
              jurisdiction of the courts of Lagos State, Nigeria.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              13. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us via WhatsApp or send an email to the address provided
              on our website.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
