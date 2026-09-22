"use client";

import { useMemo, useState } from "react";
import { Camera } from "lucide-react";
import type { GalleryMediaType, GalleryRow } from "@/types/database";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { GALLERY_MEDIA_TYPES } from "@/lib/gallery-media";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { inputClasses } from "@/components/ui/FormField";
import { StickyFilterBar } from "@/components/ui/StickyFilterBar";
import { ChipScroller, chipClasses, subChipClasses } from "@/components/ui/ChipScroller";
import { MediaCard } from "@/components/gallery/MediaCard";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

type MediaFilter = GalleryMediaType | "all";

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

  // The media filter only appears once there is actually something other
  // than photos to filter to.
  const showMediaFilter = useMemo(() => items.some((i) => i.media_type !== "photo"), [items]);

  if (items.length === 0) {
    return (
      <Container className="py-16 sm:py-20">
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
      </Container>
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
    <>
      <StickyFilterBar>
        {showMediaFilter ? (
          <ChipScroller label="Filter gallery by media type" role="tablist">
            <button
              role="tab"
              aria-selected={mediaType === "all"}
              onClick={() => selectMedia("all")}
              className={chipClasses(mediaType === "all")}
            >
              All Media
            </button>
            {GALLERY_MEDIA_TYPES.map((t) => (
              <button
                key={t.value}
                role="tab"
                aria-selected={mediaType === t.value}
                onClick={() => selectMedia(t.value)}
                className={chipClasses(mediaType === t.value)}
              >
                {t.filterLabel}
              </button>
            ))}
          </ChipScroller>
        ) : null}

        {/* Program areas stay a select on small screens — seven long
            labels read better in a dropdown than as chips — and keep the
            chip row from `sm` up, where they fit. */}
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

        <div className="hidden sm:block">
          <ChipScroller label="Filter gallery by program area" role="tablist">
            <button
              role="tab"
              aria-selected={category === "all"}
              onClick={() => selectCategory("all")}
              className={
                showMediaFilter
                  ? subChipClasses(category === "all")
                  : chipClasses(category === "all")
              }
            >
              All Program Areas
            </button>
            {GALLERY_CATEGORIES.map((c) => (
              <button
                key={c.value}
                role="tab"
                aria-selected={category === c.value}
                onClick={() => selectCategory(c.value)}
                className={
                  showMediaFilter
                    ? subChipClasses(category === c.value)
                    : chipClasses(category === c.value)
                }
              >
                {c.label}
              </button>
            ))}
          </ChipScroller>
        </div>
      </StickyFilterBar>

      <Container className="py-8 sm:py-12">
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
      </Container>

      {activeIndex !== null ? (
        <GalleryLightbox
          items={filtered}
          activeIndex={activeIndex}
          onClose={() => openItem(null)}
          onNavigate={openItem}
        />
      ) : null}
    </>
  );
}
