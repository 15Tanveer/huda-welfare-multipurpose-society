"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAdmin } from "@/actions/auth";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />

      <FormField label="Email" htmlFor="email" required>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClasses}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" required>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClasses}
        />
      </FormField>

      {!state.success && state.message ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f3d22] disabled:opacity-70"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
