"use client";

import { Check, Share2 } from "lucide-react";
import { useShareLink } from "@/components/gallery/use-share-link";

/**
 * The share control on a gallery card, so media can be passed on
 * straight from the grid without opening it first.
 *
 * Rendered as a sibling of the card's own button rather than inside it —
 * a button within a button is invalid markup and unreachable by
 * keyboard — and layered above it, so a tap here shares instead of
 * opening the item.
 */
export function ShareCardButton({ url, title }: { url: string; title: string }) {
  const { copied, share } = useShareLink(url, title);
  const label = copied ? "Link copied" : "Share";

  return (
    <button
      type="button"
      onClick={share}
      aria-label={label}
      title={label}
      className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-deep shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
