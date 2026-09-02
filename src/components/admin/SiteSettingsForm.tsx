"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateSiteSettings } from "@/actions/settings";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";
import type { SiteSettings } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettings, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep sm:col-span-2">
          Organization
        </h2>
        <FormField label="Organization Name" htmlFor="organization_name" required error={errors.organization_name?.[0]}>
          <input id="organization_name" name="organization_name" defaultValue={settings.organization_name} required className={inputClasses} />
        </FormField>
        <FormField label="Short Name" htmlFor="short_name" required error={errors.short_name?.[0]}>
          <input id="short_name" name="short_name" defaultValue={settings.short_name} required className={inputClasses} />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Tagline" htmlFor="tagline" error={errors.tagline?.[0]}>
            <input id="tagline" name="tagline" defaultValue={settings.tagline ?? ""} className={inputClasses} />
          </FormField>
        </div>
        <FormField label="Registration Number" htmlFor="registration_number" error={errors.registration_number?.[0]}>
          <input id="registration_number" name="registration_number" defaultValue={settings.registration_number ?? ""} className={inputClasses} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep sm:col-span-2">
          Location
        </h2>
        <div className="sm:col-span-2">
          <FormField label="Address" htmlFor="address" error={errors.address?.[0]}>
            <input id="address" name="address" defaultValue={settings.address ?? ""} className={inputClasses} />
          </FormField>
        </div>
        <FormField label="City" htmlFor="city" required error={errors.city?.[0]}>
          <input id="city" name="city" defaultValue={settings.city} required className={inputClasses} />
        </FormField>
        <FormField label="State" htmlFor="state" required error={errors.state?.[0]}>
          <input id="state" name="state" defaultValue={settings.state} required className={inputClasses} />
        </FormField>
        <FormField label="Postal Code" htmlFor="postal_code" error={errors.postal_code?.[0]}>
          <input id="postal_code" name="postal_code" defaultValue={settings.postal_code ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="Google Maps URL" htmlFor="google_maps_url" error={errors.google_maps_url?.[0]}>
          <input id="google_maps_url" name="google_maps_url" defaultValue={settings.google_maps_url ?? ""} className={inputClasses} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep sm:col-span-2">
          Contact
        </h2>
        <FormField label="Phone" htmlFor="phone" error={errors.phone?.[0]}>
          <input id="phone" name="phone" defaultValue={settings.phone ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp?.[0]}>
          <input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.[0]}>
          <input id="email" name="email" type="email" defaultValue={settings.email ?? ""} className={inputClasses} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep sm:col-span-2">
          Social Links
        </h2>
        <FormField label="Facebook" htmlFor="facebook" error={errors.facebook?.[0]}>
          <input id="facebook" name="facebook" defaultValue={settings.facebook ?? ""} className={inputClasses} placeholder="https://" />
        </FormField>
        <FormField label="Instagram" htmlFor="instagram" error={errors.instagram?.[0]}>
          <input id="instagram" name="instagram" defaultValue={settings.instagram ?? ""} className={inputClasses} placeholder="https://" />
        </FormField>
        <FormField label="YouTube" htmlFor="youtube" error={errors.youtube?.[0]}>
          <input id="youtube" name="youtube" defaultValue={settings.youtube ?? ""} className={inputClasses} placeholder="https://" />
        </FormField>
        <FormField label="LinkedIn" htmlFor="linkedin" error={errors.linkedin?.[0]}>
          <input id="linkedin" name="linkedin" defaultValue={settings.linkedin ?? ""} className={inputClasses} placeholder="https://" />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
          Mission &amp; Vision
        </h2>
        <FormField label="Mission" htmlFor="mission" error={errors.mission?.[0]}>
          <textarea id="mission" name="mission" rows={3} defaultValue={settings.mission ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="Vision" htmlFor="vision" error={errors.vision?.[0]}>
          <textarea id="vision" name="vision" rows={3} defaultValue={settings.vision ?? ""} className={inputClasses} />
        </FormField>
      </section>

      {state.message ? (
        <p role="status" className={`text-sm font-medium ${state.success ? "text-brand-deep" : "text-red-600"}`}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isPending} className="self-start">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}
