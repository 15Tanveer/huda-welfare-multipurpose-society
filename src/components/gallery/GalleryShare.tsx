"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

// Labels on the two secondary controls are hidden below `sm` (their
// icons and aria-labels carry the meaning there), so all three fit one
// row on a 360px phone without shrinking the tap targets.
const buttonClasses =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20";

/**
 * Share controls inside the gallery lightbox.
 *
 * Every share points at HUDA's own deep link for the item
 * (`/gallery?item=…`), never at the YouTube or news URL directly, so a
 * shared video or clipping brings people to the site — the original is
 * still one click away once they land here.
 */
export function GalleryShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (or denied) — the WhatsApp button and
      // the address bar both still work.
    }
  }

  // Support is checked at click time rather than on mount: reading
  // `navigator` while rendering would differ between the server and the
  // browser, and this keeps the markup identical in both.
  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelled by the visitor, or the sheet failed to open — fall
        // through to copying instead.
      }
    }
    await copyLink();
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

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
        onClick={copyLink}
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
