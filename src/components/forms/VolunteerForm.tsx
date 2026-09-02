"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { submitVolunteerForm } from "@/actions/forms";
import { VOLUNTEER_AREAS } from "@/lib/constants";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export function VolunteerForm() {
  const [state, formAction, isPending] = useActionState(submitVolunteerForm, initialState);
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Full Name" htmlFor="full_name" required error={errors.full_name?.[0]}>
            <input id="full_name" name="full_name" type="text" required className={inputClasses} />
          </FormField>
          <FormField label="Phone Number" htmlFor="phone" required error={errors.phone?.[0]}>
            <input id="phone" name="phone" type="tel" required className={inputClasses} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Email" htmlFor="email" required error={errors.email?.[0]}>
            <input id="email" name="email" type="email" required className={inputClasses} />
          </FormField>
          <FormField label="City" htmlFor="city" required error={errors.city?.[0]}>
            <input id="city" name="city" type="text" required className={inputClasses} />
          </FormField>
        </div>

        <FormField
          label="Area of Interest"
          htmlFor="area_of_interest"
          required
          error={errors.area_of_interest?.[0]}
        >
          <select
            id="area_of_interest"
            name="area_of_interest"
            required
            defaultValue=""
            className={inputClasses}
          >
            <option value="" disabled>
              Select an area
            </option>
            {VOLUNTEER_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Message" htmlFor="message" error={errors.message?.[0]}>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={inputClasses}
            placeholder="Tell us a little about how you'd like to help (optional)"
          />
        </FormField>

        <Button type="submit" size="lg" disabled={isPending} className="self-start">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {isPending ? "Submitting…" : "Submit Volunteer Interest"}
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
