import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { GalleryRow } from "@/types/database";

export async function getGalleryItems(): Promise<GalleryRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getGalleryItemById(id: string): Promise<GalleryRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("gallery").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}
