"use client";

import { Check, Link2 } from "lucide-react";
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
  const { copied, copy, share, hrefs } = useShareLink(url, title);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-white">Share this media</span>

      <div className="flex items-center gap-2">
        {/* Opens the device's own share sheet where there is one; falls
            back to copying the link where there isn't. */}
        <button
          type="button"
          onClick={share}
          aria-label="Share"
          className={`${iconButtonClasses} bg-white/10 hover:bg-white/20`}
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
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

      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:ml-auto"
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}
