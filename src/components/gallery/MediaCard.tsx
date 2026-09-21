"use client";

import { useState } from "react";
import Image from "next/image";
import { Newspaper, Play } from "lucide-react";
import type { GalleryRow } from "@/types/database";
import { galleryThumbnailUrl } from "@/lib/gallery-media";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";

const cardClasses =
  "group relative block w-full overflow-hidden rounded-xl border border-brand-ink/8 bg-brand-light/30 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const imageSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

function Badge({ icon: Icon, children }: { icon: typeof Play; children: string }) {
  return (
    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-brand-ink/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * One card in the public gallery grid.
 *
 * Videos and press coverage use a fixed aspect ratio with cropped
 * `object-cover` thumbnails, so a portrait newspaper clipping can never
 * blow a card up to its natural height; photos keep their natural
 * proportions inside the existing masonry columns. No player or embed is
 * mounted here — that happens only once the lightbox opens.
 */
export function MediaCard({ item, onOpen }: { item: GalleryRow; onOpen: () => void }) {
  // A derived thumbnail can 404 (a YouTube video made private, say), and
  // a broken <img> renders its alt text across the card — so fall back
  // to the brand placeholder instead.
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const url = thumbnailFailed ? null : galleryThumbnailUrl(item);
  const label = item.title || item.caption || null;

  if (item.media_type === "video") {
    return (
      <button type="button" onClick={onOpen} className={cardClasses}>
        <span className="relative block aspect-video w-full overflow-hidden bg-brand-ink/5">
          {url ? (
            <Image
              src={url}
              alt={label ?? "HUDA programme video"}
              fill
              sizes={imageSizes}
              onError={() => setThumbnailFailed(true)}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <BrandPlaceholder icon={Play} className="h-full w-full" />
          )}
          <span className="absolute inset-0 bg-brand-ink/15 transition-colors group-hover:bg-brand-ink/25" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
            <Play className="ml-0.5 h-6 w-6 fill-brand-deep text-brand-deep" aria-hidden="true" />
          </span>
        </span>
        <Badge icon={Play}>Video / Reel</Badge>
        {label ? (
          <span className="block px-3.5 py-3 text-sm font-medium text-brand-ink">{label}</span>
        ) : null}
      </button>
    );
  }

  if (item.media_type === "press") {
    return (
      <button type="button" onClick={onOpen} className={cardClasses}>
        <span className="relative block aspect-[4/3] w-full overflow-hidden bg-white">
          {url ? (
            <Image
              src={url}
              alt={label ?? "Press coverage of a HUDA programme"}
              fill
              sizes={imageSizes}
              onError={() => setThumbnailFailed(true)}
              // Clippings are usually portrait: anchor the crop to the
              // top so the masthead and headline stay visible.
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <BrandPlaceholder icon={Newspaper} className="h-full w-full" />
          )}
        </span>
        <Badge icon={Newspaper}>Press Coverage</Badge>
        <span className="block px-3.5 py-3">
          {item.source_name ? (
            <span className="block text-xs font-semibold uppercase tracking-wide text-brand">
              {item.source_name}
            </span>
          ) : null}
          {label ? (
            <span className="mt-0.5 block text-sm font-medium text-brand-ink">{label}</span>
          ) : null}
        </span>
      </button>
    );
  }

  if (!url) return null;

  return (
    <button type="button" onClick={onOpen} className={cardClasses}>
      <Image
        src={url}
        alt={item.caption || item.title || "HUDA community activity photograph"}
        width={480}
        height={360}
        sizes={imageSizes}
        className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {item.caption ? (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-ink/70 to-transparent px-3 py-2 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {item.caption}
        </span>
      ) : null}
    </button>
  );
}
