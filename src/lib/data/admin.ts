import { createClient } from "@/lib/supabase/server";
import type {
  ContactSubmissionRow,
  VolunteerSubmissionRow,
} from "@/types/database";

export interface DashboardStats {
  totalPrograms: number;
  upcomingPrograms: number;
  completedPrograms: number;
  galleryImages: number;
  volunteerRequests: number;
  newContactMessages: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    totalPrograms,
    upcomingPrograms,
    completedPrograms,
    galleryImages,
    volunteerRequests,
    newContactMessages,
  ] = await Promise.all([
    supabase.from("programs").select("id", { count: "exact", head: true }),
    supabase
      .from("programs")
      .select("id", { count: "exact", head: true })
      .eq("status", "upcoming"),
    supabase
      .from("programs")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed"),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
    supabase.from("volunteer_submissions").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  return {
    totalPrograms: totalPrograms.count ?? 0,
    upcomingPrograms: upcomingPrograms.count ?? 0,
    completedPrograms: completedPrograms.count ?? 0,
    galleryImages: galleryImages.count ?? 0,
    volunteerRequests: volunteerRequests.count ?? 0,
    newContactMessages: newContactMessages.count ?? 0,
  };
}

export async function getVolunteerSubmissions(): Promise<VolunteerSubmissionRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("volunteer_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getContactSubmissions(): Promise<ContactSubmissionRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
