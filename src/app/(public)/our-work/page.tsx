import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FOCUS_AREAS, APPROACH_PRINCIPLES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "The areas HUDA Welfare & Educational Multipurpose Society intends to work in: education, healthcare, skill development, women empowerment, social awareness and community welfare.",
  alternates: { canonical: "/our-work" },
};

export default function OurWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Where we intend to focus our efforts"
        description="HUDA is organizing its programs around six core areas. As we grow, each area will be filled in with real programs, reports and photographs."
      />

      <Container className="flex flex-col gap-16 py-16 sm:py-20">
        <section className="flex flex-col gap-8">
          {FOCUS_AREAS.map(({ slug, title, description, icon: Icon }, index) => (
            <div
              key={slug}
              className={`flex flex-col gap-6 rounded-2xl border border-brand-ink/8 bg-white p-8 sm:flex-row sm:items-center ${
                index % 2 === 1 ? "sm:flex-row-reverse" : ""
              }`}
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand-deep">
                <Icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-brand-ink">{title}</h2>
                <p className="leading-relaxed text-brand-muted">{description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Our Approach"
            title="How we plan to work"
            description="These principles will guide every program HUDA runs, starting with our first planned event."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {APPROACH_PRINCIPLES.map(({ title, description, icon: Icon }) => (
              <div key={title} className="flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-brand-light/20 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-deep">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="font-semibold text-brand-ink">{title}</p>
                <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-3xl bg-brand-deep p-10 text-white sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">See what&apos;s coming up</h2>
          <p className="max-w-xl text-white/80">
            Our programs page tracks upcoming and completed activities as they happen.
          </p>
          <Button href="/programs" size="lg" className="!bg-white !text-brand-deep hover:!bg-brand-light">
            View Programs
          </Button>
        </section>
      </Container>
    </>
  );
}
