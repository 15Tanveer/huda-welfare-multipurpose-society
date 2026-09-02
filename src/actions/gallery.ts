"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { galleryFormSchema } from "@/lib/validations/program";
import type { ActionResult } from "@/types";

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

export async function createGalleryItem(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const imagePath = formData.get("image_path");
  if (typeof imagePath !== "string" || !imagePath) {
    return { success: false, message: "Please upload an image first." };
  }

  const parsed = galleryFormSchema.safeParse({
    title: formData.get("title"),
    caption: formData.get("caption"),
    category: formData.get("category"),
    program_id: formData.get("program_id"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("gallery").insert({
    ...parsed.data,
    image_path: imagePath,
  });

  if (error) {
    return { success: false, message: "Something went wrong while saving the photo." };
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true, message: "Photo added to the gallery." };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Could not delete this photo." };
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true, message: "Photo deleted." };
}
