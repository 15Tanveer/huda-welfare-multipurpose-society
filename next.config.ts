import type { NextConfig } from "next";

/**
 * Resolves Supabase config from either the manual `.env.example` names or
 * the names Vercel's native Supabase integration adds automatically
 * (e.g. `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
 * `SUPABASE_ANON_KEY`) — whichever is present. Manual names always win so
 * a developer can still override locally.
 *
 * This file runs as plain Node during `next build`/`next dev`, so it can
 * read every process.env var (public or not) and re-expose the two public
 * ones under the canonical `NEXT_PUBLIC_` names via the `env` option
 * below — Next.js then inlines that resolved value everywhere the app
 * code writes `process.env.NEXT_PUBLIC_SUPABASE_URL` /
 * `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` literally, in both server
 * and client bundles. The service role / secret key is intentionally
 * NOT resolved here — see src/lib/supabase/env.ts, which falls back to
 * SUPABASE_SECRET_KEY directly in server-only code instead, so it's
 * never at risk of being inlined into a client bundle.
 */
const resolvedSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

const resolvedSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

const supabaseHostname = resolvedSupabaseUrl
  ? new URL(resolvedSupabaseUrl).hostname
  : undefined;

const nextConfig: NextConfig = {
  env: {
    ...(resolvedSupabaseUrl ? { NEXT_PUBLIC_SUPABASE_URL: resolvedSupabaseUrl } : {}),
    ...(resolvedSupabaseAnonKey
      ? { NEXT_PUBLIC_SUPABASE_ANON_KEY: resolvedSupabaseAnonKey }
      : {}),
  },
  images: {
    qualities: [60, 75, 90],
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https" as const,
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
