"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import type { GalleryRow } from "@/types/database";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { getSiteUrl } from "@/lib/site-url";
import {
  galleryItemLabel,
  galleryShareUrl,
  galleryThumbnailUrl,
  resolveVideoEmbed,
  watchOriginalLabel,
} from "@/lib/gallery-media";
import { GalleryShare } from "@/components/gallery/GalleryShare";

interface GalleryLightboxProps {
  items: GalleryRow[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({ items, activeIndex, onClose, onNavigate }: GalleryLightboxProps) {
  const item = items[activeIndex];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((activeIndex + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((activeIndex - 1 + items.length) % items.length);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, items.length, onClose, onNavigate]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  if (!item) return null;

  const caption = item.caption || item.title;
  const label = galleryItemLabel(item);
  // Only resolved once this dialog is mounted, so no YouTube, Instagram
  // or Facebook embed is ever requested while browsing the grid.
  const embed = item.media_type === "video" ? resolveVideoEmbed(item) : null;
  const imageUrl =
    item.media_type === "video" ? galleryThumbnailUrl(item) : getPublicImageUrl(item.image_path);
  const hasArrows = items.length > 1;
  // NEXT_PUBLIC_SITE_URL is inlined into the client bundle, so this is
  // the same string on the server and in the browser — no hydration gap,
  // and a share from a preview build still points at the real site.
  const shareUrl = galleryShareUrl(item, getSiteUrl());

  return (
    // The dialog scrolls rather than clipping when a tall portrait
    // clipping or a long caption exceeds the viewport, so its controls
    // are `fixed` and don't scroll away with the content.
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-ink/90"
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close"
        className="fixed right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {hasArrows ? (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex - 1 + items.length) % items.length);
            }}
            aria-label="Previous item"
            className="fixed left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex + 1) % items.length);
            }}
            aria-label="Next item"
            className="fixed right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        {/* Clicking the backdrop closes; clicking the content itself must
            not, so the whole panel stops propagation. The side padding
            exists only when the arrows do, so a single item still gets
            the full width of a narrow phone. */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full max-w-4xl flex-col items-center gap-4 ${
            hasArrows ? "px-10 sm:px-14" : ""
          }`}
        >
          {embed?.kind === "iframe" ? (
            <div
              className={`w-full overflow-hidden rounded-xl bg-black ${
                embed.portrait ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"
              }`}
            >
              <iframe
                src={embed.src}
                title={label}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : embed?.kind === "file" ? (
            <video
              src={embed.src}
              controls
              autoPlay
              playsInline
              className="max-h-[70vh] w-full rounded-xl bg-black"
            />
          ) : embed?.kind === "link" ? (
            <div className="flex w-full flex-col items-center gap-4 rounded-xl bg-white/5 px-6 py-10 text-center">
              {imageUrl ? (
                <div className="relative h-40 w-full max-w-md overflow-hidden rounded-lg">
                  <Image src={imageUrl} alt="" fill sizes="448px" className="object-cover" />
                </div>
              ) : null}
              <p className="text-sm text-white/85">
                This video can&rsquo;t be played here. Open it on the original site instead.
              </p>
              <a
                href={embed.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-light"
              >
                Watch Video
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          ) : imageUrl ? (
            <div className="relative h-[60vh] w-full sm:h-[70vh]">
              <Image
                src={imageUrl}
                alt={caption ?? label}
                fill
                sizes="90vw"
                className="object-contain"
                preload
              />
            </div>
          ) : null}

          <div className="flex max-w-2xl flex-col items-center gap-2 text-center">
            {item.media_type === "press" && item.source_name ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {item.source_name}
              </p>
            ) : null}
            {item.title ? <p className="text-base font-medium text-white">{item.title}</p> : null}
            {caption && caption !== item.title ? (
              <p className="text-sm text-white/85">{caption}</p>
            ) : null}
            {item.media_type === "press" && item.coverage_url ? (
              <a
                href={item.coverage_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 underline underline-offset-4 transition-colors hover:text-white"
              >
                View Original Coverage
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}

            {/* A video plays in the modal, but people still want the
                original — on YouTube it also counts towards HUDA's own
                channel. `link` embeds already offer their own button. */}
            {item.media_type === "video" && item.video_url && embed?.kind !== "link" ? (
              <a
                href={item.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 underline underline-offset-4 transition-colors hover:text-white"
              >
                {watchOriginalLabel(item)}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}

            {shareUrl ? (
              <div className="mt-2">
                <GalleryShare url={shareUrl} title={label} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
