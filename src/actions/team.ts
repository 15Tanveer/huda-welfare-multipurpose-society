"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { teamMemberFormSchema } from "@/lib/validations/program";
import type { ActionResult } from "@/types";

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

function parseTeamForm(formData: FormData) {
  return teamMemberFormSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    designation: formData.get("designation"),
    bio: formData.get("bio"),
    display_order: formData.get("display_order"),
    is_active: formData.get("is_active") === "on",
  });
}

export async function createTeamMember(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseTeamForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const photoUrl = formData.get("photo_url");

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").insert({
    ...parsed.data,
    photo_url: typeof photoUrl === "string" && photoUrl ? photoUrl : null,
  });

  if (error) {
    return { success: false, message: "Something went wrong while saving the team member." };
  }

  revalidatePath("/about");
  revalidatePath("/admin/team");
  return { success: true, message: "Team member added." };
}

export async function updateTeamMember(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseTeamForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const photoUrl = formData.get("photo_url");

  const supabase = await createClient();
  const { error } = await supabase
    .from("team_members")
    .update({
      ...parsed.data,
      photo_url: typeof photoUrl === "string" && photoUrl ? photoUrl : null,
    })
    .eq("id", id);

  if (error) {
    return { success: false, message: "Something went wrong while saving the team member." };
  }

  revalidatePath("/about");
  revalidatePath("/admin/team");
  return { success: true, message: "Team member updated." };
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Could not delete this team member." };
  }

  revalidatePath("/about");
  revalidatePath("/admin/team");
  return { success: true, message: "Team member deleted." };
}
