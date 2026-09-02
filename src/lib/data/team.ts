import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { TeamMemberRow } from "@/types/database";

export async function getActiveTeamMembers(): Promise<TeamMemberRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  return data ?? [];
}

export async function getAllTeamMembers(): Promise<TeamMemberRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });
  return data ?? [];
}

export async function getTeamMemberById(id: string): Promise<TeamMemberRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}
