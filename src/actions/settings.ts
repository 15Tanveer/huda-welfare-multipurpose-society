"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { siteSettingsFormSchema } from "@/lib/validations/program";
import type { ActionResult } from "@/types";

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

export async function updateSiteSettings(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = siteSettingsFormSchema.safeParse({
    organization_name: formData.get("organization_name"),
    short_name: formData.get("short_name"),
    tagline: formData.get("tagline"),
    registration_number: formData.get("registration_number"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    postal_code: formData.get("postal_code"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    facebook: formData.get("facebook"),
    instagram: formData.get("instagram"),
    youtube: formData.get("youtube"),
    linkedin: formData.get("linkedin"),
    google_maps_url: formData.get("google_maps_url"),
    mission: formData.get("mission"),
    vision: formData.get("vision"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...parsed.data }, { onConflict: "id" });

  if (error) {
    return { success: false, message: "Something went wrong while saving settings." };
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Site settings updated." };
}
