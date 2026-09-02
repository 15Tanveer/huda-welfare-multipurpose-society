"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { submitContactForm } from "@/actions/forms";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [prevState, setPrevState] = useState(state);
  const [dismissed, setDismissed] = useState(false);

  if (state !== prevState) {
    setPrevState(state);
    setDismissed(false);
  }

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  const toastOpen = Boolean(state.message) && !dismissed;
  const errors = state.fieldErrors ?? {};

  return (
    <>
      <form ref={formRef} action={formAction} className="flex flex-col gap-5" noValidate>
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

        <Button type="submit" size="lg" disabled={isPending} className="self-start">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {isPending ? "Sending…" : "Send Message"}
        </Button>
      </form>

      <Toast
        open={toastOpen}
        message={state.message}
        variant={state.success ? "success" : "error"}
        onClose={() => setDismissed(true)}
      />
    </>
  );
}
