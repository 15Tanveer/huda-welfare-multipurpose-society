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

/**
 * Gallery items an admin linked to a program via "Link to a program".
 *
 * This is the general `gallery` collection, which is a different table
 * from `program_gallery` (the program's own photo set, managed on the
 * program edit screen). The program page merges the two — see
 * @/components/gallery/ProgramMediaSections — rather than duplicating
 * rows across both.
 */
export async function getGalleryItemsByProgram(programId: string): Promise<GalleryRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .eq("program_id", programId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}
