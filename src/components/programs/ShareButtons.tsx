"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore, link is still visible in the URL bar.
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-ink/10 text-brand-deep transition-colors hover:bg-brand-light"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-ink/10 text-brand-deep transition-colors hover:bg-brand-light"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
