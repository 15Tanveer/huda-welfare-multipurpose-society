import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Anon-key Supabase client with no cookie/session handling. Safe to call
 * from anywhere — Server Components, Route Handlers, `generateStaticParams`,
 * `sitemap.ts` — unlike the cookie-aware client in `./server`, which calls
 * `next/headers`' `cookies()` and throws when there is no request context
 * (e.g. during static generation at build time).
 *
 * Only use this for reads that are genuinely public regardless of who's
 * asking — i.e. where the RLS policy doesn't distinguish `anon` from
 * `authenticated`. Admin-only reads (e.g. inactive team members, form
 * submissions) still need the session-aware client from `./server`.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
