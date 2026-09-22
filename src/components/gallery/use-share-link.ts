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

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  return { copied, copy, share, whatsappHref };
}
