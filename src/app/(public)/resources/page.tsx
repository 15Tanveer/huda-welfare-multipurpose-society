import type { Metadata } from "next";
import { Info, SquareArrowOutUpRight } from "lucide-react";
import { getActiveResources } from "@/lib/data/resources";
import { OFFICIAL_RESOURCE_SHORTCUTS } from "@/lib/resources-config";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResourcesExplorer } from "@/components/resources/ResourcesExplorer";

const DISCLAIMER =
  "HUDA shares these resources to improve awareness and access to useful information. Eligibility and benefits are determined by the respective government department or organization.";

export const metadata: Metadata = {
  title: "Resources & Opportunities",
  description:
    "Discover useful government schemes, scholarships, programs and opportunities related to education, healthcare, skills, employment and community development in Hinganghat.",
  alternates: { canonical: "/resources" },
};

export default async function ResourcesPage() {
  const resources = await getActiveResources();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Resources & Opportunities"
        description="Discover useful government schemes, scholarships, programs and opportunities related to education, healthcare, skills, employment and community development."
      >
        <p className="flex max-w-2xl items-start gap-2 text-sm leading-relaxed text-white/70">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {DISCLAIMER}
        </p>
      </PageHero>

      <Container className="flex flex-col gap-16 py-16 sm:py-20">
        <ResourcesExplorer resources={resources} />

        <section className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Official Government Resources"
            title="Go straight to the source"
            description="These official government platforms let you search schemes and benefits directly."
            as="h2"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {OFFICIAL_RESOURCE_SHORTCUTS.map((shortcut) => (
              <a
                key={shortcut.url}
                href={shortcut.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-2xl border border-brand-ink/8 bg-white p-6 transition-colors hover:bg-brand-light/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                      {shortcut.subtitle}
                    </p>
                    <h3 className="text-lg font-semibold text-brand-ink">{shortcut.title}</h3>
                  </div>
                  <SquareArrowOutUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-brand-muted transition-colors group-hover:text-brand-deep"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm leading-relaxed text-brand-muted">{shortcut.description}</p>
                <span className="mt-1 text-xs text-brand-muted">
                  Opens the official external website in a new tab
                </span>
              </a>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
