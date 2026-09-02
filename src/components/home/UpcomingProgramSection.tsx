import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import type { ProgramRow } from "@/types/database";
import { formatProgramDate } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { getPublicImageUrl } from "@/lib/supabase/storage";

export function UpcomingProgramSection({ program }: { program: ProgramRow | null }) {
  if (!program) return null;

  const coverUrl = getPublicImageUrl(program.cover_image);
  const hasRealDetails = program.venue || program.title !== "Upcoming Community Program";

  return (
    <section className="bg-brand-light/40 py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Upcoming Program"
          title="Save the date"
          description="HUDA's first community program is being planned. Full details will be shared here as they are confirmed."
        />

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-brand-ink/8 bg-white shadow-sm shadow-brand-ink/5 lg:grid-cols-2">
          <div className="relative min-h-56 w-full">
            {coverUrl ? (
              <Image src={coverUrl} alt={program.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <BrandPlaceholder className="h-full min-h-56 w-full" />
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 p-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
              Upcoming Program
            </span>

            <div className="flex items-center gap-2 text-2xl font-semibold text-brand-ink">
              <CalendarDays className="h-6 w-6 text-brand" aria-hidden="true" />
              {formatProgramDate(program.date)}
            </div>

            {hasRealDetails ? (
              <>
                <h3 className="text-xl font-semibold text-brand-ink">{program.title}</h3>
                <p className="leading-relaxed text-brand-muted">{program.short_description}</p>
                {program.venue ? (
                  <p className="flex items-center gap-2 text-sm text-brand-muted">
                    <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                    {program.venue}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="leading-relaxed text-brand-muted">Details will be announced soon.</p>
            )}

            <Button href={`/programs/${program.slug}`} size="md" className="mt-2 self-start">
              View Program
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
