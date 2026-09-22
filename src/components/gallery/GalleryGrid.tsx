"use client";

import { useMemo, useState } from "react";
import { Camera } from "lucide-react";
import type { GalleryMediaType, GalleryRow } from "@/types/database";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { GALLERY_MEDIA_TYPES } from "@/lib/gallery-media";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/FormField";
import { MediaCard } from "@/components/gallery/MediaCard";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

type MediaFilter = GalleryMediaType | "all";

const pillClasses = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active ? "bg-brand-deep text-white" : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
  }`;

export function GalleryGrid({
  items,
  /** `?item=` from the URL — a shared link opens straight on that item. */
  initialItemId,
}: {
  items: GalleryRow[];
  initialItemId?: string;
}) {
  const [category, setCategory] = useState<string>("all");
  const [mediaType, setMediaType] = useState<MediaFilter>("all");
  // Resolved during the first render rather than in an effect, so a
  // shared link paints with the item already open. Filters start at
  // "all", so this index is the item's index in `filtered` too.
  const [activeIndex, setActiveIndex] = useState<number | null>(() => {
    if (!initialItemId) return null;
    const index = items.findIndex((i) => i.id === initialItemId);
    return index === -1 ? null : index;
  });

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (category === "all" || i.category === category) &&
          (mediaType === "all" || i.media_type === mediaType)
      ),
    [items, category, mediaType]
  );

  // A photo-only gallery keeps exactly the filter UI it has today — the
  // media filter only appears once there is actually something other
  // than photos to filter to.
  const showMediaFilter = useMemo(
    () => items.some((i) => i.media_type !== "photo"),
    [items]
  );

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title="Stories from our work will live here"
        description="Photographs, videos and media coverage from HUDA programs and community initiatives will be added as activities are conducted."
        action={
          <Button href="/programs" variant="outline" size="md">
            View Upcoming Programs
          </Button>
        }
      />
    );
  }

  /**
   * Opens or closes an item, keeping the address bar in step so the link
   * a visitor copies (or shares from the lightbox) points at this exact
   * item. `replaceState` rather than a router push: the gallery is
   * already rendered, so there is nothing to re-fetch and the back
   * button shouldn't have to step through every item someone browsed.
   */
  function openItem(index: number | null) {
    setActiveIndex(index);
    const item = index === null ? null : filtered[index];
    window.history.replaceState(null, "", item ? `/gallery?item=${item.id}` : "/gallery");
  }

  function selectMedia(next: MediaFilter) {
    setMediaType(next);
    openItem(null);
  }

  function selectCategory(next: string) {
    setCategory(next);
    openItem(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {showMediaFilter ? (
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter gallery by media type"
          >
            <button
              role="tab"
              aria-selected={mediaType === "all"}
              onClick={() => selectMedia("all")}
              className={pillClasses(mediaType === "all")}
            >
              All Media
            </button>
            {GALLERY_MEDIA_TYPES.map((t) => (
              <button
                key={t.value}
                role="tab"
                aria-selected={mediaType === t.value}
                onClick={() => selectMedia(t.value)}
                className={pillClasses(mediaType === t.value)}
              >
                {t.filterLabel}
              </button>
            ))}
          </div>
        ) : null}

        {/* Seven programme areas are too many pills for a 360px screen,
            so small screens get a select and wider ones keep the pills. */}
        <div className="sm:hidden">
          <label htmlFor="gallery-category" className="sr-only">
            Filter gallery by program area
          </label>
          <select
            id="gallery-category"
            value={category}
            onChange={(e) => selectCategory(e.target.value)}
            className={inputClasses}
          >
            <option value="all">All Program Areas</option>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="hidden flex-wrap gap-2 sm:flex"
          role="tablist"
          aria-label="Filter gallery by program area"
        >
          <button
            role="tab"
            aria-selected={category === "all"}
            onClick={() => selectCategory("all")}
            className={pillClasses(category === "all")}
          >
            All Program Areas
          </button>
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c.value}
              role="tab"
              aria-selected={category === c.value}
              onClick={() => selectCategory(c.value)}
              className={pillClasses(category === c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="Nothing here yet"
          description="Try another filter, or check back after HUDA's upcoming programs."
        />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {filtered.map((item, index) => (
            <MediaCard key={item.id} item={item} onOpen={() => openItem(index)} />
          ))}
        </div>
      )}

      {activeIndex !== null ? (
        <GalleryLightbox
          items={filtered}
          activeIndex={activeIndex}
          onClose={() => openItem(null)}
          onNavigate={openItem}
        />
      ) : null}
    </div>
  );
}
