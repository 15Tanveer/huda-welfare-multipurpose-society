import type { ResourceRow } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ResourceCard } from "@/components/resources/ResourceCard";

/**
 * Only rendered once at least one featured, active resource exists —
 * mirrors RecentProgramsSection's "hide until real content exists" rule.
 */
export function ResourcesSection({ resources }: { resources: ResourceRow[] }) {
  if (resources.length === 0) return null;

  return (
    <section className="bg-brand-light/30 py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Resources"
            title="Schemes & Opportunities"
            description="Explore useful information about government schemes, scholarships, skills and community opportunities."
          />
          <Button href="/resources" variant="outline" size="md">
            Explore Resources
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </Container>
    </section>
  );
}
