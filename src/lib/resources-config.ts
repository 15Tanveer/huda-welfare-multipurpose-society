/**
 * Single source of truth for the Resources & Opportunities feature's
 * classification values — mirrors the pattern in src/lib/focus-areas.ts.
 * These value lists back the database CHECK constraints
 * (supabase/migrations/0005_resources.sql), the Zod validation in
 * src/lib/validations/resource.ts, the admin form selects, and the
 * public filter UI, so there is exactly one place to add or rename a
 * category/type/scope.
 */

export type ResourceCategory =
  | "education-scholarships"
  | "skills-employment"
  | "healthcare-welfare"
  | "women-child-support"
  | "agriculture-rural-development"
  | "social-welfare"
  | "other-opportunities";

export const RESOURCE_CATEGORIES: { value: ResourceCategory; label: string }[] = [
  { value: "education-scholarships", label: "Education & Scholarships" },
  { value: "skills-employment", label: "Skills & Employment" },
  { value: "healthcare-welfare", label: "Healthcare & Welfare" },
  { value: "women-child-support", label: "Women & Child Support" },
  { value: "agriculture-rural-development", label: "Agriculture & Rural Development" },
  { value: "social-welfare", label: "Social Welfare" },
  { value: "other-opportunities", label: "Other Opportunities" },
];

export type ResourceKind =
  | "government-scheme"
  | "scholarship"
  | "training-program"
  | "employment-opportunity"
  | "education-opportunity"
  | "health-resource"
  | "community-resource"
  | "other";

export const RESOURCE_TYPES: { value: ResourceKind; label: string }[] = [
  { value: "government-scheme", label: "Government Scheme" },
  { value: "scholarship", label: "Scholarship" },
  { value: "training-program", label: "Training Program" },
  { value: "employment-opportunity", label: "Employment Opportunity" },
  { value: "education-opportunity", label: "Education Opportunity" },
  { value: "health-resource", label: "Health Resource" },
  { value: "community-resource", label: "Community Resource" },
  { value: "other", label: "Other" },
];

/** Resource types whose official CTA reads "Apply" rather than "Visit". */
const APPLY_TYPES: ResourceKind[] = [
  "government-scheme",
  "scholarship",
  "training-program",
  "employment-opportunity",
];

export function officialLinkCtaLabel(resourceType: ResourceKind): string {
  return APPLY_TYPES.includes(resourceType) ? "Apply on Official Portal" : "Visit Official Website";
}

export type ResourceScope = "central" | "maharashtra" | "other";

export const RESOURCE_SCOPES: { value: ResourceScope; label: string }[] = [
  { value: "central", label: "Central" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "other", label: "Other" },
];

/**
 * "active" is the only publicly visible state. "needs-verification" lets
 * admin flag a resource whose information may be stale without deleting
 * it — see the "Last Verified" workflow. "archived" is a soft-delete for
 * outdated resources (e.g. an expired one-time scheme).
 */
export type ResourceStatus = "active" | "needs-verification" | "archived";

export const RESOURCE_STATUSES: { value: ResourceStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "needs-verification", label: "Needs Verification" },
  { value: "archived", label: "Archived" },
];

export function resourceCategoryLabel(value: string): string {
  return RESOURCE_CATEGORIES.find((c) => c.value === value)?.label ?? "Other Opportunities";
}

export function resourceTypeLabel(value: string): string {
  return RESOURCE_TYPES.find((t) => t.value === value)?.label ?? "Other";
}

export function resourceScopeLabel(value: string): string {
  return RESOURCE_SCOPES.find((s) => s.value === value)?.label ?? "Other";
}

/**
 * Official, government-run discovery platforms HUDA points people to
 * rather than trying to replace. Deliberately a small hardcoded list, not
 * an admin-configurable table — these two portals almost never change,
 * and a full settings-driven system would be over-engineering for two
 * static links. Text-only cards, no logos, so HUDA never appears to
 * imitate their branding.
 */
export const OFFICIAL_RESOURCE_SHORTCUTS = [
  {
    title: "Find Government Schemes",
    subtitle: "myScheme — Government of India",
    description:
      "Use the Government of India's myScheme platform to discover schemes based on your profile and eligibility.",
    url: "https://www.myscheme.gov.in/",
  },
  {
    title: "Maharashtra MahaDBT",
    subtitle: "Government of Maharashtra",
    description:
      "Access Maharashtra government scholarships, benefit schemes and eligible services through the official MahaDBT portal.",
    url: "https://mahadbt.maharashtra.gov.in/",
  },
] as const;
