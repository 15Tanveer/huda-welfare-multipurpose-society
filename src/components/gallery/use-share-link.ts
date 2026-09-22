"use client";

import { useState } from "react";

/**
 * Sharing behaviour shared by the gallery card button and the lightbox's
 * share row.
 *
 * The `url` handed in is always HUDA's own link for the item
 * (`/gallery?item=…`), never the YouTube or news URL, so a shared video
 * or clipping brings people to the site.
 */
export function useShareLink(url: string, title: string) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable or denied — WhatsApp and the address
      // bar both still work.
    }
  }

  /**
   * Opens the device's own share sheet (WhatsApp, Instagram, anything
   * installed) where there is one, and copies the link where there
   * isn't — most desktop browsers.
   *
   * Support is checked at click time rather than during render: reading
   * `navigator` while rendering would differ between the server and the
   * browser and break hydration.
   */
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
    await copy();
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — ${url}`);

  /** Each platform's own share endpoint — no SDK, no tracking script. */
  const hrefs = {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  return { copied, copy, share, hrefs };
}
