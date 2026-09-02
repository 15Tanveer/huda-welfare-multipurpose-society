"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitVolunteerForm } from "@/actions/forms";
import { VOLUNTEER_AREAS } from "@/lib/constants";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export function VolunteerForm() {
  const [state, formAction, isPending] = useActionState(submitVolunteerForm, initialState);

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

      {!state.success && state.message ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isPending} className="self-start">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Submitting…" : "Submit Volunteer Interest"}
      </Button>
    </form>
  );
}
