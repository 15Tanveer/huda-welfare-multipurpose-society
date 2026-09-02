import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Tag } from "lucide-react";
import {
  getAllProgramSlugs,
  getProgramBySlug,
  getProgramGallery,
} from "@/lib/data/programs";
import { getSiteSettings } from "@/lib/settings";
import { PROGRAM_CATEGORIES } from "@/lib/constants";
import { formatProgramDate, formatTimeRange } from "@/lib/format";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { programEventJsonLd } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { Button } from "@/components/ui/Button";
import { ShareButtons } from "@/components/programs/ShareButtons";
import { ProgramStats } from "@/components/programs/ProgramStats";

export async function generateStaticParams() {
  const slugs = await getAllProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Render on-demand per request rather than caching a static shell for
// unmatched slugs — this guarantees a genuine 404 status for invalid
// program slugs instead of a cached 200 "not found" page (see spec:
// "Programs with invalid slug should return proper 404").
export const dynamic = "force-dynamic";

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: "Program Not Found" };

  return {
    title: program.title,
    description: program.short_description,
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: {
      title: program.title,
      description: program.short_description,
      images: program.cover_image ? [getPublicImageUrl(program.cover_image) ?? ""] : undefined,
    },
  };
}

function TextSection({ title, content }: { title: string; content: string | null }) {
  if (!content) return null;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-brand-ink">{title}</h2>
      <p className="whitespace-pre-line leading-relaxed text-brand-muted">{content}</p>
    </div>
  );
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const [gallery, settings] = await Promise.all([
    getProgramGallery(program.id),
    getSiteSettings(),
  ]);

  const coverUrl = getPublicImageUrl(program.cover_image);
  const categoryLabel =
    PROGRAM_CATEGORIES.find((c) => c.value === program.category)?.label ?? "Community";
  const timeRange = formatTimeRange(program.start_time, program.end_time);
  const pageUrl = `${getSiteUrl()}/programs/${program.slug}`;
  const eventJsonLd = programEventJsonLd(program, settings);

  return (
    <>
      {eventJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      ) : null}

      <div className="relative aspect-[21/9] w-full overflow-hidden border-b border-brand-ink/10 sm:aspect-[3/1]">
        {coverUrl ? (
          <Image src={coverUrl} alt={program.title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <BrandPlaceholder className="h-full w-full" />
        )}
      </div>

      <Container className="flex flex-col gap-10 py-12 sm:py-16">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={program.status} />
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
              <Tag className="h-4 w-4" aria-hidden="true" />
              {categoryLabel}
            </span>
          </div>

          <h1 className="text-balance text-3xl font-semibold text-brand-ink sm:text-4xl">
            {program.title}
          </h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-muted">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
              {formatProgramDate(program.date)}
            </span>
            {timeRange ? (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand" aria-hidden="true" />
                {timeRange}
              </span>
            ) : null}
            {program.venue ? (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                {program.venue}
                {program.address ? `, ${program.address}` : ""}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {program.registration_link && program.status === "upcoming" ? (
              <Button href={program.registration_link} target="_blank" rel="noopener noreferrer">
                Register / Learn More
              </Button>
            ) : null}
            <ShareButtons title={program.title} url={pageUrl} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-10">
            <TextSection title="About This Program" content={program.description} />
            <TextSection title="Summary" content={program.summary} />
            <TextSection title="Objectives" content={program.objectives} />
            <TextSection title="Program Highlights" content={program.activities} />
            <TextSection title="Outcomes" content={program.outcomes} />

            {gallery.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-brand-ink">Program Gallery</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((item) => {
                    const url = getPublicImageUrl(item.image_path);
                    if (!url) return null;
                    return (
                      <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl border border-brand-ink/8">
                        <Image
                          src={url}
                          alt={item.caption || program.title}
                          fill
                          sizes="(min-width: 640px) 33vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6">
            <ProgramStats program={program} />
            <div className="rounded-2xl border border-brand-ink/8 bg-brand-light/30 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
                Quick Details
              </p>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-brand-muted">Date</dt>
                  <dd className="text-right font-medium text-brand-ink">
                    {formatProgramDate(program.date)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-brand-muted">Category</dt>
                  <dd className="text-right font-medium text-brand-ink">{categoryLabel}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-brand-muted">City</dt>
                  <dd className="text-right font-medium text-brand-ink">{program.city}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
