import { BookOpen, HeartPulse, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/types";

export function HeroSection({ settings }: { settings: SiteSettings }) {
  const location = [settings.city, settings.state].filter(Boolean).join(", ");

  return (
    <section className="leaf-pattern relative overflow-hidden bg-brand-deep">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-deep via-brand-deep to-brand"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-brand-light/10 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-start gap-8 py-20 sm:py-24 lg:py-28">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-light">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
          {location || "Hinganghat, Maharashtra"}
        </span>

        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {settings.organization_name}
        </h1>

        <p className="max-w-2xl text-balance text-lg leading-relaxed text-white/85 sm:text-xl">
          {settings.tagline ??
            "Working together for education, healthcare, empowerment and community welfare."}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/our-work" variant="secondary" size="lg" className="!bg-white !text-brand-deep hover:!bg-brand-light">
            Explore Our Work
          </Button>
          <Button
            href="/get-involved"
            size="lg"
            variant="outline"
            className="!border-white/40 !bg-transparent !text-white hover:!bg-white/10"
          >
            Get Involved
          </Button>
        </div>

        {settings.registration_number ? (
          <p className="text-xs text-white/60">
            Registration No. {settings.registration_number}
          </p>
        ) : null}

        <div className="mt-4 grid w-full grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          {[
            { icon: BookOpen, label: "Education & Awareness" },
            { icon: HeartPulse, label: "Healthcare Support" },
            { icon: Users, label: "Community Empowerment" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-white/85">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
