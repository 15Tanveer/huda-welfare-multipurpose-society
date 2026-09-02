import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { SocialLinks } from "@/components/layout/SocialLinks";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Contact Us",
    description: `Get in touch with ${settings.organization_name} in ${settings.city}, ${settings.state}.`,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const location = [settings.address, settings.city, settings.state, settings.postal_code]
    .filter(Boolean)
    .join(", ");
  const hasAnyContactDetail =
    settings.phone || settings.whatsapp || settings.email || settings.address || location;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch with HUDA"
        description={`${settings.organization_name}, ${settings.city}, ${settings.state}, India.`}
      />

      <Container className="grid grid-cols-1 gap-12 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow="Reach Us" title="Contact details" as="h2" />

          {hasAnyContactDetail ? (
            <ul className="flex flex-col gap-5">
              {location ? (
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-deep">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-ink">Address</p>
                    <p className="text-sm text-brand-muted">{location}</p>
                    {settings.google_maps_url ? (
                      <a
                        href={settings.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-brand hover:underline"
                      >
                        View on Google Maps
                      </a>
                    ) : null}
                  </div>
                </li>
              ) : null}

              {settings.phone ? (
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-deep">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-ink">Phone</p>
                    <a href={`tel:${settings.phone}`} className="text-sm text-brand-muted hover:text-brand-deep">
                      {settings.phone}
                    </a>
                  </div>
                </li>
              ) : null}

              {settings.whatsapp ? (
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-deep">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-ink">WhatsApp</p>
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-muted hover:text-brand-deep"
                    >
                      {settings.whatsapp}
                    </a>
                  </div>
                </li>
              ) : null}

              {settings.email ? (
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-deep">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-ink">Email</p>
                    <a href={`mailto:${settings.email}`} className="text-sm text-brand-muted hover:text-brand-deep">
                      {settings.email}
                    </a>
                  </div>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-brand-muted">
              Our contact details are being finalised — please use the form and we&apos;ll
              respond as soon as possible.
            </p>
          )}

          <SocialLinks settings={settings} />
        </div>

        <div className="rounded-2xl border border-brand-ink/8 bg-white p-6 shadow-sm shadow-brand-ink/5 sm:p-8">
          <SectionHeading eyebrow="Send a Message" title="We'd love to hear from you" as="h2" />
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </Container>
    </>
  );
}
