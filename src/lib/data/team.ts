import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { TeamMemberRow } from "@/types/database";

// Governing-body members are managed in the admin panel but are not
// rendered on the public website (see About page) — the `team_members`
// table's RLS only grants read access to authenticated (admin) users, so
// every read here goes through the cookie-aware authenticated client and
// is only ever called from dynamic /admin/* routes, never at build time.

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
