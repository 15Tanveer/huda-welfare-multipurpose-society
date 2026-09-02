import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { ResourceRow } from "@/types/database";
import { resourceCategoryLabel, resourceScopeLabel, resourceTypeLabel } from "@/lib/resources-config";
import { formatIsoDateLong } from "@/lib/format";

export function ResourceCard({ resource }: { resource: ResourceRow }) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-white p-6 shadow-sm shadow-brand-ink/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-ink/10"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-brand-light px-2.5 py-1 text-xs font-medium text-brand-deep">
          {resourceTypeLabel(resource.resource_type)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 px-2.5 py-1 text-xs font-medium text-brand-deep">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {resourceScopeLabel(resource.scope)}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-brand-ink transition-colors group-hover:text-brand-deep">
        {resource.title}
      </h3>

      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        {resourceCategoryLabel(resource.category)}
      </p>

      <p className="line-clamp-2 text-sm leading-relaxed text-brand-muted">
        {resource.short_description}
      </p>

      {resource.audience_tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {resource.audience_tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-brand-ink/10 bg-brand-light/40 px-2 py-0.5 text-[11px] font-medium text-brand-deep"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : resource.audience ? (
        <p className="text-xs text-brand-muted">
          <span className="font-medium text-brand-ink">Who it&apos;s for: </span>
          {resource.audience}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        {resource.last_verified_at ? (
          <p className="text-xs text-brand-muted">
            Verified {formatIsoDateLong(resource.last_verified_at)}
          </p>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-deep">
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
