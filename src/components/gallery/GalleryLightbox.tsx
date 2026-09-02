"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryRow } from "@/types/database";
import { getPublicImageUrl } from "@/lib/supabase/storage";

interface GalleryLightboxProps {
  items: GalleryRow[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({ items, activeIndex, onClose, onNavigate }: GalleryLightboxProps) {
  const item = items[activeIndex];

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

  if (!item) return null;
  const url = getPublicImageUrl(item.image_path);
  const caption = item.caption || item.title;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption ?? "Gallery image"}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-ink/90 p-4"
    >
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {items.length > 1 ? (
        <>
          <button
            onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            onClick={() => onNavigate((activeIndex + 1) % items.length)}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      ) : null}

      {url ? (
        <div className="relative h-[70vh] w-full max-w-4xl">
          <Image
            src={url}
            alt={caption ?? "HUDA activity photograph"}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>
      ) : null}

      {caption ? (
        <p className="mt-4 max-w-2xl text-center text-sm text-white/85">{caption}</p>
      ) : null}
    </div>
  );
}
