"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { galleryFormSchema, normalizeGalleryInput } from "@/lib/validations/program";
import type { ActionResult } from "@/types";

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

function parseGalleryForm(formData: FormData) {
  return galleryFormSchema.safeParse({
    media_type: formData.get("media_type"),
    title: formData.get("title"),
    caption: formData.get("caption"),
    category: formData.get("category"),
    program_id: formData.get("program_id"),
    image_path: formData.get("image_path"),
    video_url: formData.get("video_url"),
    video_source: formData.get("video_source"),
    source_name: formData.get("source_name"),
    source_logo_path: formData.get("source_logo_path"),
    source_url: formData.get("source_url"),
    coverage_url: formData.get("coverage_url"),
  });
}

function revalidateGallery() {
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function createGalleryItem(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseGalleryForm(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("gallery").insert(normalizeGalleryInput(parsed.data));

  if (error) {
    return { success: false, message: "Something went wrong while saving this item." };
  }

  revalidateGallery();
  return { success: true, message: "Added to the gallery." };
}

export async function updateGalleryItem(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseGalleryForm(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery")
    .update(normalizeGalleryInput(parsed.data))
    .eq("id", id);

  if (error) {
    return { success: false, message: "Something went wrong while saving this item." };
  }

  revalidateGallery();
  revalidatePath(`/admin/gallery/${id}/edit`);
  return { success: true, message: "Gallery item updated." };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Could not delete this item." };
  }

  revalidateGallery();
  return { success: true, message: "Gallery item deleted." };
}
