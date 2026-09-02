"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { programFormSchema } from "@/lib/validations/program";
import type { ActionResult } from "@/types";

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

function parseProgramForm(formData: FormData) {
  return programFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    short_description: formData.get("short_description"),
    description: formData.get("description"),
    date: formData.get("date"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    venue: formData.get("venue"),
    address: formData.get("address"),
    city: formData.get("city"),
    category: formData.get("category"),
    status: formData.get("status"),
    registration_link: formData.get("registration_link"),
    featured: formData.get("featured") === "on",
    summary: formData.get("summary"),
    objectives: formData.get("objectives"),
    activities: formData.get("activities"),
    outcomes: formData.get("outcomes"),
    participant_count: formData.get("participant_count"),
    volunteer_count: formData.get("volunteer_count"),
    beneficiary_count: formData.get("beneficiary_count"),
    cover_image: formData.get("cover_image"),
  });
}

export async function createProgram(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseProgramForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const coverImage = formData.get("cover_image");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .insert({
      ...parsed.data,
      cover_image: typeof coverImage === "string" && coverImage ? coverImage : null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "A program with this slug already exists. Please choose a different slug.",
        fieldErrors: { slug: ["This slug is already in use."] },
      };
    }
    return { success: false, message: "Something went wrong while saving the program." };
  }

  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/admin/programs");
  redirect(`/admin/programs/${data.id}/edit?created=1`);
}

export async function updateProgram(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseProgramForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const coverImage = formData.get("cover_image");

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("programs")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("programs")
    .update({
      ...parsed.data,
      cover_image: typeof coverImage === "string" && coverImage ? coverImage : null,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "A program with this slug already exists. Please choose a different slug.",
        fieldErrors: { slug: ["This slug is already in use."] },
      };
    }
    return { success: false, message: "Something went wrong while saving the program." };
  }

  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/admin/programs");
  revalidatePath(`/programs/${parsed.data.slug}`);
  if (existing?.slug && existing.slug !== parsed.data.slug) {
    revalidatePath(`/programs/${existing.slug}`);
  }

  return { success: true, message: "Program updated successfully." };
}

export async function deleteProgram(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("programs").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Could not delete this program." };
  }

  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/admin/programs");
  return { success: true, message: "Program deleted." };
}

export async function addProgramGalleryImage(
  programId: string,
  imagePath: string,
  caption: string | null
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("program_gallery").insert({
    program_id: programId,
    image_path: imagePath,
    caption,
  });

  if (error) {
    return { success: false, message: "Could not add this photo." };
  }

  revalidatePath(`/admin/programs/${programId}/edit`);
  return { success: true, message: "Photo added." };
}

export async function deleteProgramGalleryImage(
  programId: string,
  imageId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("program_gallery").delete().eq("id", imageId);

  if (error) {
    return { success: false, message: "Could not remove this photo." };
  }

  revalidatePath(`/admin/programs/${programId}/edit`);
  return { success: true, message: "Photo removed." };
}
