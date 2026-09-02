import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { GalleryRow } from "@/types/database";

// `gallery` RLS grants full read access to anon and authenticated alike,
// so this uses the cookie-free public client — safe from build-time
// contexts too (see @/lib/supabase/public).

export async function getGalleryItems(): Promise<GalleryRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getGalleryItemById(id: string): Promise<GalleryRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createPublicClient();
  const { data } = await supabase.from("gallery").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}
