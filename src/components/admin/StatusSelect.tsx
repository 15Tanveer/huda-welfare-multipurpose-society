"use client";

import { useTransition } from "react";
import type { SubmissionStatus } from "@/types/database";
import type { ActionResult } from "@/types";

export function StatusSelect({
  status,
  options,
  onChange,
}: {
  status: SubmissionStatus;
  options: SubmissionStatus[];
  onChange: (status: SubmissionStatus) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as SubmissionStatus;
        startTransition(() => {
          onChange(next);
        });
      }}
      className="rounded-full border border-brand-ink/15 bg-white px-3 py-1.5 text-xs font-medium capitalize text-brand-ink disabled:opacity-60"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="capitalize">
          {opt}
        </option>
      ))}
    </select>
  );
}
