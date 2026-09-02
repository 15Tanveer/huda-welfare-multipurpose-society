import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ResourceRow } from "@/types/database";

// Public reads only ever need active resources, which the public client
// can see under RLS (`resources_public_read_active`) — used on statically
// generated pages, so it must not depend on request cookies. Admin reads
// need every resource regardless of status, which requires the
// authenticated cookie-aware client (`resources_admin_all` RLS policy)
// and are only ever called from dynamic /admin/* routes.

export async function getActiveResources(): Promise<ResourceRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "active")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getFeaturedResources(limit = 3): Promise<ResourceRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getResourceBySlug(slug: string): Promise<ResourceRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data ?? null;
}

export async function getAllActiveResourceSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase.from("resources").select("slug").eq("status", "active");
  return (data ?? []).map((r) => r.slug);
}

export async function getAdminResourceList(): Promise<ResourceRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getResourceById(id: string): Promise<ResourceRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}
