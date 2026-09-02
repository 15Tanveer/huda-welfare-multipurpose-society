import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, CalendarClock, Info, MapPin } from "lucide-react";
import { getAllActiveResourceSlugs, getResourceBySlug } from "@/lib/data/resources";
import {
  officialLinkCtaLabel,
  resourceCategoryLabel,
  resourceScopeLabel,
  resourceTypeLabel,
} from "@/lib/resources-config";
import { formatIsoDateLong, isPastDeadline } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ShareButtons } from "@/components/programs/ShareButtons";

export async function generateStaticParams() {
  const slugs = await getAllActiveResourceSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return { title: "Resource Not Found" };

  return {
    title: `${resource.title} – Eligibility, Benefits & How to Apply`,
    description: resource.short_description,
    alternates: { canonical: `/resources/${resource.slug}` },
  };
}

function DetailSection({ title, content }: { title: string; content: string | null }) {
  if (!content) return null;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-brand-ink">{title}</h2>
      <p className="whitespace-pre-line leading-relaxed text-brand-muted">{content}</p>
    </div>
  );
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  const pageUrl = `${getSiteUrl()}/resources/${resource.slug}`;
  const deadlinePassed = resource.application_deadline
    ? isPastDeadline(resource.application_deadline)
    : false;

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-brand-light px-2.5 py-1 text-xs font-medium text-brand-deep">
            {resourceTypeLabel(resource.resource_type)}
          </span>
          <span className="inline-flex items-center rounded-full bg-brand-light px-2.5 py-1 text-xs font-medium text-brand-deep">
            {resourceCategoryLabel(resource.category)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 px-2.5 py-1 text-xs font-medium text-brand-deep">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {resourceScopeLabel(resource.scope)}
          </span>
        </div>

        <h1 className="text-balance text-3xl font-semibold text-brand-ink sm:text-4xl">
          {resource.title}
        </h1>

        {resource.provided_by ? (
          <p className="text-sm text-brand-muted">
            <span className="font-medium text-brand-ink">Provided by: </span>
            {resource.provided_by}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {resource.official_url ? (
            <Button href={resource.official_url} target="_blank" rel="noopener noreferrer" size="lg">
              {officialLinkCtaLabel(resource.resource_type)}
            </Button>
          ) : null}
          <ShareButtons title={resource.title} url={pageUrl} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-10">
          <DetailSection title="Overview" content={resource.description} />
          <DetailSection title="Who Can Benefit" content={resource.audience} />
          <DetailSection title="Eligibility" content={resource.eligibility} />
          <DetailSection title="Benefits" content={resource.benefits} />
          <DetailSection title="Documents Required" content={resource.documents_required} />
          <DetailSection title="How to Apply" content={resource.how_to_apply} />
          <DetailSection title="Important Notes" content={resource.important_notes} />

          {resource.official_url ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-brand-light/30 p-6">
              <h2 className="text-lg font-semibold text-brand-ink">Official Source</h2>
              <p className="text-sm leading-relaxed text-brand-muted">
                Always confirm the latest details — deadlines, documents and benefits — on the
                official government website before applying.
              </p>
              <Button
                href={resource.official_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="self-start"
              >
                {officialLinkCtaLabel(resource.resource_type)}
              </Button>
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6">
          {resource.application_deadline ? (
            <div className="flex items-start gap-3 rounded-2xl border border-brand-ink/8 bg-white p-5">
              <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-brand-ink">Application Deadline</p>
                {deadlinePassed ? (
                  <p className="text-sm text-brand-muted">
                    Application period may have ended. Please verify the current status on the
                    official portal.
                  </p>
                ) : (
                  <p className="text-sm text-brand-muted">{formatIsoDateLong(resource.application_deadline as string)}</p>
                )}
              </div>
            </div>
          ) : null}

          {resource.last_verified_at ? (
            <div className="flex items-start gap-3 rounded-2xl border border-brand-ink/8 bg-white p-5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-brand-ink">Last Verified</p>
                <p className="text-sm text-brand-muted">{formatIsoDateLong(resource.last_verified_at)}</p>
              </div>
            </div>
          ) : null}

          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-amber-900">
              HUDA provides this information for awareness and guidance purposes. Scheme
              eligibility, benefits, deadlines and application requirements are determined by the
              respective government authority. Please verify the latest information on the
              official portal before applying.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
