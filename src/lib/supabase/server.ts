import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Supabase client for use inside Server Components, Server Actions and
 * Route Handlers. Reads/writes the auth session via the Next.js cookie
 * store, following the current @supabase/ssr guidance.
 *
 * Note: Server Components cannot write cookies, so `setAll` is wrapped in
 * a try/catch there — the proxy (middleware) is responsible for actually
 * refreshing the session cookie on every request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — safe to ignore because the
          // proxy refreshes the session on every request.
        }
      },
    },
  });
}
