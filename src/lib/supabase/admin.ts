import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely, so
 * it must NEVER be imported from a Client Component or exposed to the
 * browser. The `server-only` import throws a build error if that happens.
 *
 * Use sparingly — only where the anon-key + RLS combination genuinely
 * cannot express the required access (e.g. admin write operations that
 * are already gated behind authenticated /admin routes).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
