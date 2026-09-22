"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Newspaper,
  Play,
  Users,
  X,
} from "lucide-react";
import type { GalleryRow, ProgramRow } from "@/types/database";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { getSiteUrl } from "@/lib/site-url";
import { FOCUS_AREAS } from "@/lib/focus-areas";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { formatProgramDate } from "@/lib/format";
import { cityWithDistrict } from "@/lib/local-seo";
import {
  galleryItemLabel,
  galleryShareUrl,
  galleryThumbnailUrl,
  mediaTypeBadgeLabel,
  resolveVideoEmbed,
  watchOriginalLabel,
} from "@/lib/gallery-media";
import { LogoMark } from "@/components/icons/LogoMark";
import { GalleryShare } from "@/components/gallery/GalleryShare";

interface GalleryLightboxProps {
  items: GalleryRow[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Programs the items link to, keyed by id — for the context block. */
  programs?: Record<string, ProgramRow>;
}

const controlClasses =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";

function Meta({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CalendarDays;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-5 w-5 shrink-0 text-white/50" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs text-white/60">{label}</span>
        <span className="block truncate text-sm font-medium text-white">{children}</span>
      </span>
    </div>
  );
}

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
  programs = {},
}: GalleryLightboxProps) {
  const item = items[activeIndex];
  const closeRef = useRef<HTMLButtonElement>(null);
  // The player is mounted only once someone asks for it, even inside the
  // modal: stepping through items with the arrows shouldn't pull an
  // embed for every video along the way.
  const [playing, setPlaying] = useState(false);
  const [playingFor, setPlayingFor] = useState(activeIndex);

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

  // Showing a different item now, so the previous player goes away.
  // Adjusted during render rather than in an effect, so the old embed
  // never paints for a frame against the new item.
  if (playingFor !== activeIndex) {
    setPlayingFor(activeIndex);
    setPlaying(false);
  }

  if (!item) return null;

  const label = galleryItemLabel(item);
  const caption = item.caption && item.caption !== item.title ? item.caption : null;
  const embed = item.media_type === "video" ? resolveVideoEmbed(item) : null;
  const imageUrl =
    item.media_type === "video" ? galleryThumbnailUrl(item) : getPublicImageUrl(item.image_path);
  const shareUrl = galleryShareUrl(item, getSiteUrl());
  const categoryLabel = GALLERY_CATEGORIES.find((c) => c.value === item.category)?.label ?? null;
  const CategoryIcon = FOCUS_AREAS.find((a) => a.slug === item.category)?.icon ?? null;
  const program = item.program_id ? programs[item.program_id] : undefined;
  const programCover = getPublicImageUrl(program?.cover_image ?? null);
  const sourceLogo = getPublicImageUrl(item.source_logo_path);
  const hasArrows = items.length > 1;

  const externalLink =
    item.media_type === "press" && item.coverage_url
      ? { href: item.coverage_url, text: "View Original Coverage" }
      : item.media_type === "video" && item.video_url
        ? { href: item.video_url, text: watchOriginalLabel(item) }
        : null;

  function goPrev() {
    onNavigate((activeIndex - 1 + items.length) % items.length);
  }

  function goNext() {
    onNavigate((activeIndex + 1) % items.length);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-ink/80 backdrop-blur-md"
    >
      <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6">
        {/* Clicking the backdrop closes; clicking the panel must not. */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-brand-ink shadow-2xl"
        >
          {/* Stays put while a long panel scrolls, so close and the pager
              are always within reach. */}
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/10 bg-brand-ink/95 px-4 py-3 backdrop-blur sm:gap-3 sm:px-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
              <LogoMark className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">Media Gallery</p>
              <p className="truncate text-xs text-white/60">HUDA programs, people and impact</p>
            </div>
            {hasArrows ? (
              <>
                <span className="hidden shrink-0 text-xs tabular-nums text-white/60 sm:inline">
                  {activeIndex + 1} of {items.length}
                </span>
                <button onClick={goPrev} aria-label="Previous item" className={controlClasses}>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button onClick={goNext} aria-label="Next item" className={controlClasses}>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            ) : null}
            <button ref={closeRef} onClick={onClose} aria-label="Close" className={controlClasses}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-5">
            <div className="overflow-hidden rounded-2xl bg-black">
              {embed?.kind === "iframe" && playing ? (
                <div
                  className={
                    embed.portrait ? "mx-auto aspect-[9/16] w-full max-w-xs" : "aspect-video w-full"
                  }
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
              ) : embed?.kind === "file" && playing ? (
                <video
                  src={embed.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[60vh] w-full"
                />
              ) : item.media_type === "video" ? (
                // Thumbnail facade: tapping it mounts the real player, or
                // opens the original where nothing embeds reliably.
                <button
                  type="button"
                  onClick={() => {
                    if (embed && embed.kind !== "link") setPlaying(true);
                    else if (item.video_url) window.open(item.video_url, "_blank", "noopener");
                  }}
                  aria-label={`Play ${label}`}
                  className="group relative block aspect-video w-full"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={label}
                      fill
                      sizes="(min-width: 768px) 672px, 100vw"
                      className="object-cover"
                      preload
                    />
                  ) : null}
                  <span className="absolute inset-0 bg-brand-ink/20 transition-colors group-hover:bg-brand-ink/10" />
                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
                    <Play
                      className="ml-1 h-7 w-7 fill-brand-deep text-brand-deep"
                      aria-hidden="true"
                    />
                  </span>
                </button>
              ) : imageUrl ? (
                <div className="relative h-[42vh] w-full sm:h-[52vh]">
                  <Image
                    src={imageUrl}
                    alt={caption ?? label}
                    fill
                    sizes="(min-width: 768px) 672px, 100vw"
                    className="object-contain"
                    preload
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categoryLabel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white">
                  {CategoryIcon ? <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                  {categoryLabel}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80">
                {item.media_type === "press" ? (
                  <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                ) : item.media_type === "video" ? (
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                ) : null}
                {mediaTypeBadgeLabel(item.media_type)}
              </span>
            </div>

            {item.title ? (
              <h2 className="text-balance text-xl font-semibold leading-snug text-white sm:text-2xl">
                {item.title}
              </h2>
            ) : null}

            {caption ? <p className="text-sm leading-relaxed text-white/70">{caption}</p> : null}

            {/* Programme context, straight off the linked program row —
                the beneficiaries cell appears only when that number is
                actually recorded, never as a placeholder. */}
            {program ? (
              <>
                <div className="grid grid-cols-1 gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
                  <Meta icon={CalendarDays} label="Program Date">
                    {formatProgramDate(program.date)}
                  </Meta>
                  <Meta icon={MapPin} label="Location">
                    {program.venue ?? cityWithDistrict(program.city)}
                  </Meta>
                  {program.beneficiary_count ? (
                    <Meta icon={Users} label="Beneficiaries">
                      {program.beneficiary_count.toLocaleString("en-IN")}
                    </Meta>
                  ) : null}
                </div>

                <Link
                  href={`/programs/${program.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  {programCover ? (
                    <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={programCover} alt="" fill sizes="80px" className="object-cover" />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-white/60">Part of Program</span>
                    <span className="block truncate text-sm font-medium text-white">
                      {program.title}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-white/60" aria-hidden="true" />
                </Link>
              </>
            ) : null}

            {/* The outlet that carried the story, credited by name, mark
                and a link through to their own channel where we have
                one. Each piece renders only if it was actually filled
                in. */}
            {item.source_name || externalLink ? (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                {item.source_name ? (
                  <div className="flex min-w-0 items-center gap-3">
                    {sourceLogo ? (
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white/10">
                        <Image
                          src={sourceLogo}
                          alt={item.source_name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span className="block text-xs text-white/60">
                        {item.media_type === "press" ? "Published by" : "Coverage by"}
                      </span>
                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-white underline-offset-4 hover:underline"
                        >
                          {item.source_name}
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="block truncate text-sm font-medium text-white">
                          {item.source_name}
                        </span>
                      )}
                    </span>
                  </div>
                ) : null}

                {externalLink ? (
                  <a
                    href={externalLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
                  >
                    {externalLink.text}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ) : null}

            {shareUrl ? (
              <div className="border-t border-white/10 pt-4">
                <GalleryShare url={shareUrl} title={label} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
