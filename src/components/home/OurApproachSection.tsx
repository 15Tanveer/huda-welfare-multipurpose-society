import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { APPROACH_PRINCIPLES } from "@/lib/constants";

export function OurApproachSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Our Approach"
          title="How HUDA works"
          description="As a new organization, we want to be clear about the principles that will guide every program we run."
          align="center"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {APPROACH_PRINCIPLES.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand-deep">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-semibold text-brand-ink">{title}</p>
              <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
