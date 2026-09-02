import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ProgramRow, ProgramGalleryRow } from "@/types/database";

export async function getUpcomingPrograms(): Promise<ProgramRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("status", "upcoming")
    .order("date", { ascending: true });
  return data ?? [];
}

export async function getNextUpcomingProgram(): Promise<ProgramRow | null> {
  const programs = await getUpcomingPrograms();
  return programs[0] ?? null;
}

export async function getPastPrograms(): Promise<ProgramRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("status", "completed")
    .order("date", { ascending: false });
  return data ?? [];
}

export async function getRecentCompletedPrograms(limit = 3): Promise<ProgramRow[]> {
  const programs = await getPastPrograms();
  return programs.slice(0, limit);
}

export async function getProgramBySlug(slug: string): Promise<ProgramRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function getProgramGallery(programId: string): Promise<ProgramGalleryRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("program_gallery")
    .select("*")
    .eq("program_id", programId)
    .order("display_order", { ascending: true });
  return data ?? [];
}

export async function getAllProgramSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("programs").select("slug");
  return (data ?? []).map((p) => p.slug);
}

export async function getAdminProgramList(): Promise<ProgramRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .order("date", { ascending: false });
  return data ?? [];
}

export async function getProgramById(id: string): Promise<ProgramRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("programs").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}
