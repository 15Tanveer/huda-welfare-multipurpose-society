"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { updateSiteSettings } from "@/actions/settings";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";
import type { SiteSettings } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

interface TextFieldValues {
  organization_name: string;
  short_name: string;
  tagline: string;
  registration_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  google_maps_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  mission: string;
  vision: string;
}

function initialTextValues(settings: SiteSettings): TextFieldValues {
  return {
    organization_name: settings.organization_name ?? "",
    short_name: settings.short_name ?? "",
    tagline: settings.tagline ?? "",
    registration_number: settings.registration_number ?? "",
    address: settings.address ?? "",
    city: settings.city ?? "",
    state: settings.state ?? "",
    postal_code: settings.postal_code ?? "",
    google_maps_url: settings.google_maps_url ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    facebook: settings.facebook ?? "",
    instagram: settings.instagram ?? "",
    youtube: settings.youtube ?? "",
    linkedin: settings.linkedin ?? "",
    mission: settings.mission ?? "",
    vision: settings.vision ?? "",
  };
}

const FIELD_ORDER = [
  "organization_name",
  "short_name",
  "tagline",
  "registration_number",
  "address",
  "city",
  "state",
  "postal_code",
  "google_maps_url",
  "phone",
  "whatsapp",
  "email",
  "facebook",
  "instagram",
  "youtube",
  "linkedin",
  "mission",
  "vision",
];

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettings, initialState);
  const [values, setValues] = useState<TextFieldValues>(() => initialTextValues(settings));
  const errors = state.fieldErrors ?? {};

  const lastState = useRef<ActionResult | undefined>(undefined);
  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (!state.fieldErrors) return;
    const firstInvalidField = FIELD_ORDER.find((name) => state.fieldErrors?.[name]);
    if (!firstInvalidField) return;
    const el = document.getElementById(firstInvalidField);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus();
  }, [state]);

  const setField = (key: keyof TextFieldValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep sm:col-span-2">
          Organization
        </h2>
        <FormField label="Organization Name" htmlFor="organization_name" required error={errors.organization_name?.[0]}>
          <input id="organization_name" name="organization_name" value={values.organization_name} required className={inputClasses} onChange={setField("organization_name")} />
        </FormField>
        <FormField label="Short Name" htmlFor="short_name" required error={errors.short_name?.[0]}>
          <input id="short_name" name="short_name" value={values.short_name} required className={inputClasses} onChange={setField("short_name")} />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Tagline" htmlFor="tagline" error={errors.tagline?.[0]}>
            <input id="tagline" name="tagline" value={values.tagline} className={inputClasses} onChange={setField("tagline")} />
          </FormField>
        </div>
        <FormField label="Registration Number" htmlFor="registration_number" error={errors.registration_number?.[0]}>
          <input id="registration_number" name="registration_number" value={values.registration_number} className={inputClasses} onChange={setField("registration_number")} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep sm:col-span-2">
          Location
        </h2>
        <div className="sm:col-span-2">
          <FormField label="Address" htmlFor="address" error={errors.address?.[0]}>
            <input id="address" name="address" value={values.address} className={inputClasses} onChange={setField("address")} />
          </FormField>
        </div>
        <FormField label="City" htmlFor="city" required error={errors.city?.[0]}>
          <input id="city" name="city" value={values.city} required className={inputClasses} onChange={setField("city")} />
        </FormField>
        <FormField label="State" htmlFor="state" required error={errors.state?.[0]}>
          <input id="state" name="state" value={values.state} required className={inputClasses} onChange={setField("state")} />
        </FormField>
        <FormField label="Postal Code" htmlFor="postal_code" error={errors.postal_code?.[0]}>
          <input id="postal_code" name="postal_code" value={values.postal_code} className={inputClasses} onChange={setField("postal_code")} />
        </FormField>
        <FormField label="Google Maps URL" htmlFor="google_maps_url" error={errors.google_maps_url?.[0]}>
          <input id="google_maps_url" name="google_maps_url" value={values.google_maps_url} className={inputClasses} onChange={setField("google_maps_url")} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep sm:col-span-2">
          Contact
        </h2>
        <FormField label="Phone" htmlFor="phone" error={errors.phone?.[0]}>
          <input id="phone" name="phone" value={values.phone} className={inputClasses} onChange={setField("phone")} />
        </FormField>
        <FormField label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp?.[0]}>
          <input id="whatsapp" name="whatsapp" value={values.whatsapp} className={inputClasses} onChange={setField("whatsapp")} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.[0]}>
          <input id="email" name="email" type="email" value={values.email} className={inputClasses} onChange={setField("email")} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep sm:col-span-2">
          Social Links
        </h2>
        <FormField label="Facebook" htmlFor="facebook" error={errors.facebook?.[0]}>
          <input id="facebook" name="facebook" value={values.facebook} className={inputClasses} placeholder="https://" onChange={setField("facebook")} />
        </FormField>
        <FormField label="Instagram" htmlFor="instagram" error={errors.instagram?.[0]}>
          <input id="instagram" name="instagram" value={values.instagram} className={inputClasses} placeholder="https://" onChange={setField("instagram")} />
        </FormField>
        <FormField label="YouTube" htmlFor="youtube" error={errors.youtube?.[0]}>
          <input id="youtube" name="youtube" value={values.youtube} className={inputClasses} placeholder="https://" onChange={setField("youtube")} />
        </FormField>
        <FormField label="LinkedIn" htmlFor="linkedin" error={errors.linkedin?.[0]}>
          <input id="linkedin" name="linkedin" value={values.linkedin} className={inputClasses} placeholder="https://" onChange={setField("linkedin")} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
          Mission &amp; Vision
        </h2>
        <FormField label="Mission" htmlFor="mission" error={errors.mission?.[0]}>
          <textarea id="mission" name="mission" rows={3} value={values.mission} className={inputClasses} onChange={setField("mission")} />
        </FormField>
        <FormField label="Vision" htmlFor="vision" error={errors.vision?.[0]}>
          <textarea id="vision" name="vision" rows={3} value={values.vision} className={inputClasses} onChange={setField("vision")} />
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
