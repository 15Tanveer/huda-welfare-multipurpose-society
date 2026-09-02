"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import type { ActionResult } from "@/types";

export function DeleteButton({
  action,
  confirmMessage,
  label = "Delete",
}: {
  action: () => Promise<ActionResult>;
  confirmMessage: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) setError(result.message);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {label}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
