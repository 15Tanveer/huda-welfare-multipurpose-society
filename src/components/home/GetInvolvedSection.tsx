import { HandHeart, Handshake, Megaphone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const WAYS = [
  {
    icon: HandHeart,
    title: "Volunteer",
    description: "Give your time and skills to support HUDA's upcoming community programs.",
  },
  {
    icon: Handshake,
    title: "Partner With Us",
    description: "Collaborate as an institution, professional or local group.",
  },
  {
    icon: Megaphone,
    title: "Spread the Word",
    description: "Help more people in Hinganghat learn about HUDA's work.",
  },
];

export function GetInvolvedSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10 rounded-3xl border border-brand/15 bg-brand-light/40 px-6 py-12 sm:px-10 sm:py-14">
        <SectionHeading
          eyebrow="Get Involved"
          title="Be part of meaningful community action"
          description="Whether you contribute your time, skills, professional expertise or ideas, there are many ways to support HUDA's community initiatives."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {WAYS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm shadow-brand-ink/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-deep text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-semibold text-brand-ink">{title}</p>
              <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
            </div>
          ))}
        </div>

        <Button href="/get-involved" size="lg" className="self-start">
          Get Involved With HUDA
        </Button>
      </Container>
    </section>
  );
}
