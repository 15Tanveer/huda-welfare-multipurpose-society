"use client";

import { Check, Share2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/components/icons/SocialIcons";
import { useShareLink } from "@/components/gallery/use-share-link";

const iconButtonClasses =
  "flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

/**
 * The share row in the lightbox's details panel.
 *
 * Each button hands out HUDA's own link for the item
 * (`/gallery?item=…`), never the YouTube or news URL, so a shared reel
 * or clipping brings people to the site.
 */
export function GalleryShare({ url, title }: { url: string; title: string }) {
  const { copied, share, hrefs } = useShareLink(url, title);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-white">Share this media</span>

      <div className="flex items-center gap-2">
        {/* Opens the device's own share sheet where there is one — which
            carries its own copy action — and copies the link directly
            where there isn't, confirming with a tick. That covers both,
            so there's no separate copy button. */}
        <button
          type="button"
          onClick={share}
          aria-label={copied ? "Link copied" : "Share or copy link"}
          title={copied ? "Link copied" : "Share or copy link"}
          className={`${iconButtonClasses} bg-white/10 hover:bg-white/20`}
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Share2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        <a
          href={hrefs.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className={`${iconButtonClasses} bg-[#25D366]`}
        >
          <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
        </a>

        <a
          href={hrefs.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className={`${iconButtonClasses} bg-[#1877F2]`}
        >
          <FacebookIcon className="h-4 w-4" aria-hidden="true" />
        </a>

        <a
          href={hrefs.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className={`${iconButtonClasses} bg-black`}
        >
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </a>

        <a
          href={hrefs.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className={`${iconButtonClasses} bg-[#0A66C2]`}
        >
          <LinkedinIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
