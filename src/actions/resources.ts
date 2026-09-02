"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resourceFormSchema } from "@/lib/validations/resource";
import type { ActionResult } from "@/types";

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

function parseResourceForm(formData: FormData) {
  return resourceFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    resource_type: formData.get("resource_type"),
    category: formData.get("category"),
    short_description: formData.get("short_description"),
    description: formData.get("description"),
    audience: formData.get("audience"),
    eligibility: formData.get("eligibility"),
    benefits: formData.get("benefits"),
    documents_required: formData.get("documents_required"),
    how_to_apply: formData.get("how_to_apply"),
    important_notes: formData.get("important_notes"),
    provided_by: formData.get("provided_by"),
    official_url: formData.get("official_url"),
    application_url: formData.get("application_url"),
    audience_tags: formData.get("audience_tags"),
    scope: formData.get("scope"),
    state: formData.get("state"),
    application_deadline: formData.get("application_deadline"),
    last_verified_at: formData.get("last_verified_at"),
    featured: formData.get("featured") === "on",
    status: formData.get("status"),
  });
}

export async function createResource(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseResourceForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "A resource with this slug already exists. Please choose a different slug.",
        fieldErrors: { slug: ["This slug is already in use."] },
      };
    }
    return { success: false, message: "Something went wrong while saving the resource." };
  }

  revalidatePath("/resources");
  revalidatePath("/");
  revalidatePath("/admin/resources");
  redirect(`/admin/resources/${data.id}/edit?created=1`);
}

export async function updateResource(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseResourceForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("resources")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("resources").update(parsed.data).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "A resource with this slug already exists. Please choose a different slug.",
        fieldErrors: { slug: ["This slug is already in use."] },
      };
    }
    return { success: false, message: "Something went wrong while saving the resource." };
  }

  revalidatePath("/resources");
  revalidatePath("/");
  revalidatePath("/admin/resources");
  revalidatePath(`/resources/${parsed.data.slug}`);
  if (existing?.slug && existing.slug !== parsed.data.slug) {
    revalidatePath(`/resources/${existing.slug}`);
  }

  return { success: true, message: "Resource updated successfully." };
}

export async function deleteResource(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Could not delete this resource." };
  }

  revalidatePath("/resources");
  revalidatePath("/");
  revalidatePath("/admin/resources");
  return { success: true, message: "Resource deleted." };
}
