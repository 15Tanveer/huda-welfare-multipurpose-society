"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/types/database";
import type { ActionResult } from "@/types";

export async function updateVolunteerStatus(
  id: string,
  status: SubmissionStatus
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_submissions").update({ status }).eq("id", id);

  if (error) return { success: false, message: "Could not update status." };

  revalidatePath("/admin/volunteers");
  return { success: true, message: "Status updated." };
}

export async function deleteVolunteerSubmission(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_submissions").delete().eq("id", id);

  if (error) return { success: false, message: "Could not delete this submission." };

  revalidatePath("/admin/volunteers");
  return { success: true, message: "Submission deleted." };
}

export async function updateContactStatus(
  id: string,
  status: SubmissionStatus
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);

  if (error) return { success: false, message: "Could not update status." };

  revalidatePath("/admin/contacts");
  return { success: true, message: "Status updated." };
}

export async function deleteContactSubmission(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);

  if (error) return { success: false, message: "Could not delete this message." };

  revalidatePath("/admin/contacts");
  return { success: true, message: "Message deleted." };
}
