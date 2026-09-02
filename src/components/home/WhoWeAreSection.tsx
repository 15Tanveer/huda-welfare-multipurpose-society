import { GraduationCap, HeartHandshake, Users2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/types";

export function WhoWeAreSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow="Who We Are" title={`About ${settings.short_name}`} />
          <div className="flex flex-col gap-4 text-base leading-relaxed text-brand-muted">
            <p>
              {settings.organization_name} is a welfare and educational multipurpose
              society based in {settings.city}, {settings.state}. We are a growing
              community organization working to bring meaningful initiatives in
              education, healthcare awareness, empowerment and social welfare to the
              people around us.
            </p>
            <p>
              Our focus is on supporting underserved communities through practical,
              on-the-ground initiatives — from guiding students and families towards
              educational opportunities, to raising awareness around health and
              government schemes, to helping people build livelihood skills.
            </p>
          </div>
          <Button href="/about" variant="outline" size="md" className="self-start">
            Learn About HUDA
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[
            {
              icon: GraduationCap,
              title: "Education First",
              description: "Guidance, awareness and resources for students and families.",
            },
            {
              icon: HeartHandshake,
              title: "Healthcare Awareness",
              description: "Preventive health information and community medical camps.",
            },
            {
              icon: Users2,
              title: "Community Empowerment",
              description: "Skills, opportunities and support for underserved communities.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-brand-ink/8 bg-white p-5 shadow-sm shadow-brand-ink/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-deep">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-brand-ink">{title}</p>
                <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
