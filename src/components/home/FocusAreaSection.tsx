import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FOCUS_AREAS } from "@/lib/constants";

export function FocusAreaSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Our Focus Areas"
          title="Where we intend to make a difference"
          description="HUDA is organizing its work around six core areas of community welfare, guided by real needs on the ground in Hinganghat."
        />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-brand-ink/8 bg-brand-ink/8 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS_AREAS.map(({ slug, title, description, icon: Icon }) => (
            <div key={slug} className="flex flex-col gap-3 bg-white p-6 transition-colors hover:bg-brand-light/30">
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
