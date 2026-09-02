import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FOCUS_AREAS, NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import type { SiteSettings } from "@/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const location = [settings.city, settings.state].filter(Boolean).join(", ");

  return (
    <footer className="border-t border-brand/10 bg-white">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo shortName={settings.short_name} />
          <p className="max-w-xs text-sm leading-relaxed text-brand-muted">
            A community welfare and educational organization based in{" "}
            {location || "Hinganghat, Maharashtra"}, working towards education,
            healthcare awareness, empowerment and social welfare.
          </p>
          <SocialLinks settings={settings} />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-brand-deep">Navigation</h3>
          <ul className="flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-brand-muted transition-colors hover:text-brand-deep"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-brand-deep">Focus Areas</h3>
          <ul className="flex flex-col gap-2.5">
            {FOCUS_AREAS.slice(0, 6).map((area) => (
              <li key={area.slug}>
                <Link
                  href="/our-work"
                  className="text-sm text-brand-muted transition-colors hover:text-brand-deep"
                >
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-brand-deep">Contact</h3>
          <ul className="flex flex-col gap-3">
            {settings.address || location ? (
              <li className="flex items-start gap-2.5 text-sm text-brand-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <span>{settings.address ? `${settings.address}, ` : ""}{location}</span>
              </li>
            ) : null}
            {settings.phone ? (
              <li className="flex items-center gap-2.5 text-sm text-brand-muted">
                <Phone className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <a href={`tel:${settings.phone}`} className="hover:text-brand-deep">
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li className="flex items-center gap-2.5 text-sm text-brand-muted">
                <Mail className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <a href={`mailto:${settings.email}`} className="hover:text-brand-deep">
                  {settings.email}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </Container>

      <div className="border-t border-brand/10">
        <Container className="flex flex-col-reverse items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-brand-muted">
            © {year} {settings.organization_name}. All rights reserved.
            {settings.registration_number ? (
              <span className="block sm:inline sm:ml-1">
                Reg. No. {settings.registration_number}
              </span>
            ) : null}
          </p>
          <div className="flex items-center gap-5 text-xs text-brand-muted">
            <Link href="/privacy" className="hover:text-brand-deep">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-deep">
              Terms &amp; Disclaimer
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
