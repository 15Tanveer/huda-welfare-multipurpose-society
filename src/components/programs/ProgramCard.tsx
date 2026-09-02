import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { ProgramRow } from "@/types/database";
import { PROGRAM_CATEGORIES } from "@/lib/constants";
import { formatProgramDate } from "@/lib/format";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";

export function ProgramCard({ program }: { program: ProgramRow }) {
  const coverUrl = getPublicImageUrl(program.cover_image);
  const categoryLabel =
    PROGRAM_CATEGORIES.find((c) => c.value === program.category)?.label ?? "Community";

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-ink/8 bg-white shadow-sm shadow-brand-ink/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-ink/10"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={program.title}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <BrandPlaceholder className="h-full w-full" />
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={program.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {categoryLabel}
        </span>
        <h3 className="text-lg font-semibold text-brand-ink transition-colors group-hover:text-brand-deep">
          {program.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-brand-muted">
          {program.short_description}
        </p>
        <div className="mt-auto flex flex-col gap-1.5 pt-2 text-sm text-brand-muted">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
            {formatProgramDate(program.date)}
          </span>
          {program.venue ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
              {program.venue}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
