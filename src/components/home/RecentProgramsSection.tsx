import type { ProgramRow } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProgramCard } from "@/components/programs/ProgramCard";

/**
 * Only rendered by the homepage once at least one completed program
 * exists — see spec section 39 ("homepage after first event").
 */
export function RecentProgramsSection({ programs }: { programs: ProgramRow[] }) {
  if (programs.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Recent Activities"
            title="What HUDA has been doing"
            description="A look at our recently completed community programs."
          />
          <Button href="/programs" variant="outline" size="md">
            View All Programs
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </Container>
    </section>
  );
}
