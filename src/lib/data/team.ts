import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { TeamMemberRow } from "@/types/database";

// Public reads only ever need *active* members, which the public client
// can see under RLS — used on the (statically generated) About page, so
// it must not depend on request cookies. Admin reads need every member,
// active or not, which requires the authenticated cookie-aware client
// (`team_members_admin_all` RLS policy) and are only ever called from
// dynamic /admin/* routes, never at build time.

export async function getActiveTeamMembers(): Promise<TeamMemberRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
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
