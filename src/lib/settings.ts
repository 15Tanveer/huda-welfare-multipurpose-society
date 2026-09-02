import { cache } from "react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { SiteSettings } from "@/types";

/**
 * Reads the singleton `site_settings` row and merges it over safe
 * defaults. Any field left blank by the admin (or if Supabase isn't
 * configured yet) resolves to `null` so the UI can hide it rather than
 * inventing information. Cached per-request with React's `cache()`.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured()) {
    return DEFAULT_SITE_SETTINGS as SiteSettings;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (!data) {
      return DEFAULT_SITE_SETTINGS as SiteSettings;
    }

    return {
      organization_name: data.organization_name || DEFAULT_SITE_SETTINGS.organization_name,
      short_name: data.short_name || DEFAULT_SITE_SETTINGS.short_name,
      tagline: data.tagline ?? DEFAULT_SITE_SETTINGS.tagline,
      registration_number: data.registration_number,
      address: data.address,
      city: data.city || DEFAULT_SITE_SETTINGS.city,
      state: data.state || DEFAULT_SITE_SETTINGS.state,
      postal_code: data.postal_code,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      facebook: data.facebook,
      instagram: data.instagram,
      youtube: data.youtube,
      linkedin: data.linkedin,
      google_maps_url: data.google_maps_url,
      mission: data.mission ?? DEFAULT_SITE_SETTINGS.mission,
      vision: data.vision ?? DEFAULT_SITE_SETTINGS.vision,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS as SiteSettings;
  }
});
