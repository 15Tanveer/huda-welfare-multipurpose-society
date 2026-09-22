"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useShareLink } from "@/components/gallery/use-share-link";

// Labels on the two secondary controls are hidden below `sm` (their
// icons and aria-labels carry the meaning there), so all three fit one
// row on a 360px phone without shrinking the tap targets.
const buttonClasses =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20";

/** The full share row inside the gallery lightbox. */
export function GalleryShare({ url, title }: { url: string; title: string }) {
  const { copied, copy, share, whatsappHref } = useShareLink(url, title);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={share} className={buttonClasses}>
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </button>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={copy}
        className={buttonClasses}
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
