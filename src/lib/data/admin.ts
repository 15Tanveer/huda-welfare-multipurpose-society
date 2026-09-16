import { createClient } from "@/lib/supabase/server";
import type {
  ContactSubmissionRow,
  NewsletterSubscriberRow,
  VolunteerSubmissionRow,
} from "@/types/database";

export interface DashboardStats {
  totalPrograms: number;
  upcomingPrograms: number;
  completedPrograms: number;
  galleryImages: number;
  volunteerRequests: number;
  newContactMessages: number;
  activeResources: number;
  resourcesNeedingVerification: number;
  newsletterSubscribers: number;
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
    activeResources,
    resourcesNeedingVerification,
    newsletterSubscribers,
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
    supabase
      .from("resources")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("resources")
      .select("id", { count: "exact", head: true })
      .eq("status", "needs-verification"),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalPrograms: totalPrograms.count ?? 0,
    upcomingPrograms: upcomingPrograms.count ?? 0,
    completedPrograms: completedPrograms.count ?? 0,
    galleryImages: galleryImages.count ?? 0,
    volunteerRequests: volunteerRequests.count ?? 0,
    newContactMessages: newContactMessages.count ?? 0,
    activeResources: activeResources.count ?? 0,
    resourcesNeedingVerification: resourcesNeedingVerification.count ?? 0,
    newsletterSubscribers: newsletterSubscribers.count ?? 0,
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

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriberRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
