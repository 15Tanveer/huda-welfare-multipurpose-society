/**
 * Hinganghat's district — a fixed real-world geographic fact about the
 * town HUDA is based in, not a per-deployment setting, so it's never
 * stored in `site_settings`. Only surfaced when the configured city is
 * actually Hinganghat, so it can't become wrong if that setting changes.
 */
const HINGANGHAT_DISTRICT = "Wardha District";

export function isHinganghat(city: string): boolean {
  return city.trim().toLowerCase() === "hinganghat";
}

/** e.g. "Hinganghat, Wardha District" for Hinganghat, or just the city otherwise. */
export function cityWithDistrict(city: string): string {
  return isHinganghat(city) ? `${city}, ${HINGANGHAT_DISTRICT}` : city;
}

export { HINGANGHAT_DISTRICT };
