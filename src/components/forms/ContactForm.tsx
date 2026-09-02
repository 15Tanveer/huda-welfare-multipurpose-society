"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContactForm } from "@/actions/forms";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand/20 bg-brand-light/40 px-6 py-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand" aria-hidden="true" />
        <p className="max-w-md text-base font-medium text-brand-deep">{state.message}</p>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" required error={errors.name?.[0]}>
          <input id="name" name="name" type="text" required className={inputClasses} />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={errors.email?.[0]}>
          <input id="email" name="email" type="email" required className={inputClasses} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Phone" htmlFor="phone" error={errors.phone?.[0]}>
          <input id="phone" name="phone" type="tel" className={inputClasses} />
        </FormField>
        <FormField label="Subject" htmlFor="subject" required error={errors.subject?.[0]}>
          <input id="subject" name="subject" type="text" required className={inputClasses} />
        </FormField>
      </div>

      <FormField label="Message" htmlFor="message" required error={errors.message?.[0]}>
        <textarea id="message" name="message" rows={5} required className={inputClasses} />
      </FormField>

      {!state.success && state.message ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isPending} className="self-start">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
