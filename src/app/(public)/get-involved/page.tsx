import type { Metadata } from "next";
import { Building2, HandCoins, HeartHandshake, Users } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VolunteerForm } from "@/components/forms/VolunteerForm";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Volunteer with HUDA, partner as an organization, or support an upcoming community initiative in Hinganghat.",
  alternates: { canonical: "/get-involved" },
};

export default async function GetInvolvedPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Be part of meaningful community action"
        description="Whether you contribute your time, skills, professional expertise or ideas, there are many ways to support HUDA's community initiatives."
      />

      <Container className="flex flex-col gap-20 py-16 sm:py-20">
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-4">
            <SectionHeading eyebrow="Volunteer With HUDA" title="Share your time and skills" as="h2" />
            <p className="leading-relaxed text-brand-muted">
              Whether you can help occasionally or regularly, we&apos;d love to hear from
              you. Tell us a bit about yourself and where you&apos;d like to help — our
              team will reach out as programs are organized.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-ink/8 bg-white p-6 shadow-sm shadow-brand-ink/5 sm:p-8">
            <VolunteerForm />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-brand-light/30 p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-deep text-white">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-brand-ink">Partner With Us</h2>
            <p className="text-sm leading-relaxed text-brand-muted">
              We welcome collaboration with schools, colleges, healthcare
              professionals, businesses, institutions and community groups in{" "}
              {settings.city} on upcoming community programs.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-brand-light/30 p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-deep text-white">
              <HandCoins className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-brand-ink">Support an Initiative</h2>
            <p className="text-sm leading-relaxed text-brand-muted">
              As specific programs are announced, we will share how well-wishers can
              support them directly.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-brand-light/30 p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-deep text-white">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-brand-ink">Community Collaboration</h2>
            <p className="text-sm leading-relaxed text-brand-muted">
              We welcome ideas and collaboration from local residents and community
              groups who share our goals.
            </p>
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-3xl bg-brand-deep p-10 text-white sm:p-12">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-semibold sm:text-3xl">Questions before joining in?</h2>
          <p className="max-w-xl text-white/80">
            Reach out to us directly — our contact details are on the Contact page.
          </p>
        </section>
      </Container>
    </>
  );
}
