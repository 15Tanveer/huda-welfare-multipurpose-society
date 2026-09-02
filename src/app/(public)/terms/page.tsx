import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms & Disclaimer",
  description: "Terms of use and disclaimer for HUDA Welfare & Educational Multipurpose Society.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero eyebrow="Legal" title="Terms &amp; Disclaimer" />
      <Container className="flex max-w-3xl flex-col gap-6 py-16 text-brand-muted sm:py-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">About This Website</h2>
          <p>
            This website is operated by {settings.organization_name}, a community
            welfare and educational organization based in {settings.city}, {settings.state}.
            The content on this site is provided for general informational purposes.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">Accuracy of Information</h2>
          <p>
            As a new organization, HUDA is committed to only publishing information that
            reflects our real activities. Program details, dates and reports are updated
            by our team as programs are planned and completed. We aim to keep this
            information accurate but it may be updated without prior notice.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">Use of Content</h2>
          <p>
            Content on this website, including text and photographs of HUDA&apos;s own
            activities, belongs to {settings.organization_name} unless stated otherwise.
            Please contact us before reproducing content elsewhere.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">No Warranty</h2>
          <p>
            This website and its content are provided &quot;as is&quot; without warranties
            of any kind. We are not responsible for any loss arising from reliance on
            information published here.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">Contact</h2>
          <p>
            For questions about these terms, please reach out via our{" "}
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
