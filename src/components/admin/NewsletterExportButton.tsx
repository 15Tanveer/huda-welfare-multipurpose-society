"use client";

import { Download } from "lucide-react";
import type { NewsletterSubscriberRow } from "@/types/database";

function toCsv(subscribers: NewsletterSubscriberRow[]): string {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const header = "email,subscribed_at";
  const rows = subscribers.map((s) => `${escape(s.email)},${escape(s.created_at)}`);
  return [header, ...rows].join("\n");
}

export function NewsletterExportButton({ subscribers }: { subscribers: NewsletterSubscriberRow[] }) {
  function handleExport() {
    const csv = toCsv(subscribers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={subscribers.length === 0}
      className="inline-flex items-center gap-2 rounded-full border border-brand-ink/15 px-4 py-2 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Export CSV
    </button>
  );
}
