import type { SiteSettings } from "@/types";
import type { ProgramRow } from "@/types/database";
import { getConfiguredSiteUrl } from "@/lib/site-url";

/**
 * Builds Organization/NGO JSON-LD from real configured settings only.
 * Fields that are not configured are simply omitted — never filled with
 * placeholder or fabricated values.
 */
export function organizationJsonLd(settings: SiteSettings) {
  const siteUrl = getConfiguredSiteUrl();

  const sameAs = [
    settings.facebook,
    settings.instagram,
    settings.youtube,
    settings.linkedin,
  ].filter((v): v is string => Boolean(v));

  const address =
    settings.address || settings.city
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address ?? undefined,
          addressLocality: settings.city,
          addressRegion: settings.state,
          postalCode: settings.postal_code ?? undefined,
          addressCountry: "IN",
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: settings.organization_name,
    alternateName: settings.short_name,
    url: siteUrl,
    description: settings.tagline ?? undefined,
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
    address,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * Event JSON-LD for a program page. Only rendered when enough real data
 * exists (title, date and either a venue or address).
 */
export function programEventJsonLd(program: ProgramRow, settings: SiteSettings) {
  if (!program.venue && !program.address) return null;

  const siteUrl = getConfiguredSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: program.title,
    startDate: program.date,
    eventStatus:
      program.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: program.venue ?? undefined,
      address: program.address ?? `${program.city}, ${settings.state}`,
    },
    description: program.short_description,
    image: program.cover_image ?? undefined,
    url: siteUrl ? `${siteUrl}/programs/${program.slug}` : undefined,
    organizer: {
      "@type": "Organization",
      name: settings.organization_name,
      url: siteUrl,
    },
  };
}
