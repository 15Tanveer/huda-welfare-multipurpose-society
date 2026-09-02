"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { subscribeNewsletter } from "@/actions/forms";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-white/60 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-gold/90 disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        Subscribe
      </button>
      {state.message ? (
        <p
          role="status"
          className={`sm:basis-full text-sm ${state.success ? "text-brand-light" : "text-amber-200"}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
