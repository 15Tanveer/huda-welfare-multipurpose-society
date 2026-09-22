"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryRow, ProgramRow } from "@/types/database";
import type { ProgramMedia } from "@/lib/gallery-media";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { MediaCard } from "@/components/gallery/MediaCard";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

type Scope = keyof ProgramMedia;

interface ActiveItem {
  scope: Scope;
  index: number;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-brand-ink">{title}</h2>
      {children}
    </div>
  );
}

/**
 * The media attached to a program: its own photo set plus anything an
 * admin linked to it from the general gallery, grouped into sections.
 * Each section only renders when it actually has something in it.
 */
export function ProgramMediaSections({
  media,
  program,
}: {
  media: ProgramMedia;
  program: ProgramRow;
}) {
  const programTitle = program.title;
  const programs = { [program.id]: program };
  const [active, setActive] = useState<ActiveItem | null>(null);

  const { photos, videos, press } = media;
  if (photos.length === 0 && videos.length === 0 && press.length === 0) return null;

  const activeItems: GalleryRow[] = active ? media[active.scope] : [];

  return (
    <>
      {photos.length > 0 ? (
        <Section title="Photo Gallery">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((item, index) => {
              const url = getPublicImageUrl(item.image_path);
              if (!url) return null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive({ scope: "photos", index })}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-brand-ink/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Image
                    src={url}
                    alt={item.caption || programTitle}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        </Section>
      ) : null}

      {videos.length > 0 ? (
        <Section title="Program Videos">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {videos.map((item, index) => (
              <MediaCard
                key={item.id}
                item={item}
                onOpen={() => setActive({ scope: "videos", index })}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {press.length > 0 ? (
        <Section title="Media Coverage">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {press.map((item, index) => (
              <MediaCard
                key={item.id}
                item={item}
                onOpen={() => setActive({ scope: "press", index })}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {active && activeItems.length > 0 ? (
        <GalleryLightbox
          items={activeItems}
          activeIndex={active.index}
          onClose={() => setActive(null)}
          onNavigate={(index) => setActive({ scope: active.scope, index })}
          programs={programs}
        />
      ) : null}
    </>
  );
}
