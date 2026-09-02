"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import type { GalleryRow } from "@/types/database";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { EmptyState } from "@/components/ui/EmptyState";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

export function GalleryGrid({ items }: { items: GalleryRow[] }) {
  const [category, setCategory] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (category === "all" ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title="Our gallery is coming soon"
        description="Our activity gallery will be updated as HUDA begins conducting community programs."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery by category">
        <button
          role="tab"
          aria-selected={category === "all"}
          onClick={() => setCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "all"
              ? "bg-brand-deep text-white"
              : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
          }`}
        >
          All
        </button>
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c.value}
            role="tab"
            aria-selected={category === c.value}
            onClick={() => setCategory(c.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === c.value
                ? "bg-brand-deep text-white"
                : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="No photos in this category yet"
          description="Try another category, or check back after HUDA's upcoming programs."
        />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {filtered.map((item, index) => {
            const url = getPublicImageUrl(item.image_path);
            if (!url) return null;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(index)}
                className="group relative block w-full overflow-hidden rounded-xl border border-brand-ink/8 bg-brand-light/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Image
                  src={url}
                  alt={item.caption || item.title || "HUDA community activity photograph"}
                  width={480}
                  height={360}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.caption ? (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-ink/70 to-transparent px-3 py-2 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {item.caption}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {activeIndex !== null ? (
        <GalleryLightbox
          items={filtered}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      ) : null}
    </div>
  );
}
