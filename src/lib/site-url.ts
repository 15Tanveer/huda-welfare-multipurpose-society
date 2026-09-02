const DEFAULT_SITE_URL = "http://localhost:3000";

/**
 * The public site URL, with a safe localhost fallback for local dev and
 * for deployments where NEXT_PUBLIC_SITE_URL hasn't been configured yet.
 *
 * Uses `||` rather than `??` deliberately: on some hosts an unset env var
 * is inlined as an empty string rather than `undefined`, and `??` does not
 * treat `""` as missing — that previously reached `new URL("")` in
 * src/app/layout.tsx and crashed the production build.
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

/** Same as getSiteUrl(), but `undefined` (not a localhost guess) when unset — for optional fields like JSON-LD `url`, where a fabricated localhost URL would be misleading in production. */
export function getConfiguredSiteUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SITE_URL || undefined;
}
