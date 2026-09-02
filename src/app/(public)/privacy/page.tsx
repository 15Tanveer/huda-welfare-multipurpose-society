import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for HUDA Welfare & Educational Multipurpose Society.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Container className="flex max-w-3xl flex-col gap-6 py-16 text-brand-muted sm:py-20">
        <p>
          {settings.organization_name} (&quot;HUDA&quot;, &quot;we&quot;, &quot;us&quot;) respects your
          privacy. This page explains what information we collect through this website
          and how it is used.
        </p>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">Information We Collect</h2>
          <p>
            When you submit the volunteer form, contact form, or newsletter subscription
            on this website, we collect the information you provide — such as your name,
            phone number, email address, city and message.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">How We Use It</h2>
          <p>
            We use this information solely to respond to your enquiry, coordinate
            volunteering opportunities, or send occasional updates about HUDA&apos;s
            programs if you have subscribed. We do not sell or share your information
            with third parties for marketing purposes.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">Data Storage</h2>
          <p>
            Submitted information is stored securely and is only accessible to authorized
            HUDA administrators. It is not publicly displayed on this website.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">Contact</h2>
          <p>
            If you have questions about this policy or would like your information
            removed, please contact us using the details on our{" "}
            <a href="/contact" className="font-medium text-brand hover:underline">
              Contact page
            </a>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
