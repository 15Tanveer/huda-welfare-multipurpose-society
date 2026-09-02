"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-off-white px-6 text-center">
      <h1 className="text-3xl font-semibold text-brand-ink">Something went wrong</h1>
      <p className="max-w-md text-brand-muted">
        We&apos;re sorry, an unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f3d22]"
      >
        Try Again
      </button>
    </div>
  );
}
