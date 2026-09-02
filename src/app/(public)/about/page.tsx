import type { Metadata } from "next";
import { Award, Compass, HeartHandshake, ScrollText, Target, Users } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { getActiveTeamMembers } from "@/lib/data/team";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { APPROACH_PRINCIPLES } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "About Us",
    description: `Learn about ${settings.organization_name}, a community welfare and educational organization based in ${settings.city}, ${settings.state}.`,
    alternates: { canonical: "/about" },
  };
}

const OBJECTIVES = [
  "Support access to education, career guidance and learning resources.",
  "Raise awareness around preventive healthcare and organize medical camps.",
  "Help youth and community members build practical, livelihood-oriented skills.",
  "Promote awareness, education and opportunities for women.",
  "Run social awareness initiatives on health, education and government schemes.",
  "Support broader community welfare and development initiatives.",
];

const VALUES = [
  { icon: HeartHandshake, title: "Compassion", description: "We approach every person and every problem with empathy first." },
  { icon: Users, title: "Inclusion", description: "Our programs are open to everyone, regardless of background." },
  { icon: Award, title: "Integrity", description: "We aim to be honest and transparent in everything we do." },
  { icon: Compass, title: "Accountability", description: "We will document and share our work honestly as it happens." },
];

export default async function AboutPage() {
  const [settings, teamMembers] = await Promise.all([
    getSiteSettings(),
    getActiveTeamMembers(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="About HUDA"
        title={`About ${settings.organization_name}`}
        description={`A welfare and educational multipurpose society based in ${settings.city}, ${settings.state}.`}
      />

      <Container className="flex flex-col gap-20 py-16 sm:py-20">
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading eyebrow="Introduction" title="Who we are" as="h2" />
            <p className="leading-relaxed text-brand-muted">
              {settings.organization_name} was formed with the aim of creating meaningful
              community initiatives across education, healthcare, empowerment and social
              welfare in and around {settings.city}. We are a growing organization —
              still in our early stages — building the foundation for sustained,
              community-first work.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <SectionHeading eyebrow="Our Story" title="Where we're starting from" as="h2" />
            <p className="leading-relaxed text-brand-muted">
              HUDA began as an idea among people who wanted to see more structured,
              accountable community welfare work in {settings.city}. Rather than
              claiming a long history, we want to be upfront: this organization is at
              the start of its journey, with its first community program planned and
              its systems being put in place to grow responsibly from here.
            </p>
          </div>
        </section>

        {settings.mission || settings.vision ? (
          <section className="grid grid-cols-1 gap-6 rounded-2xl border border-brand/15 bg-brand-light/30 p-8 sm:grid-cols-2 sm:p-10">
            {settings.mission ? (
              <div className="flex flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-deep text-white">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-semibold text-brand-ink">Mission</h2>
                <p className="leading-relaxed text-brand-muted">{settings.mission}</p>
              </div>
            ) : null}
            {settings.vision ? (
              <div className="flex flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-deep text-white">
                  <Compass className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-semibold text-brand-ink">Vision</h2>
                <p className="leading-relaxed text-brand-muted">{settings.vision}</p>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="flex flex-col gap-8">
          <SectionHeading eyebrow="Our Objectives" title="What we aim to do" as="h2" />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {OBJECTIVES.map((objective) => (
              <li
                key={objective}
                className="flex items-start gap-3 rounded-xl border border-brand-ink/8 bg-white p-4 text-sm leading-relaxed text-brand-muted"
              >
                <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                {objective}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading eyebrow="Our Values" title="What guides us" as="h2" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand-deep">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="font-semibold text-brand-ink">{title}</p>
                <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading eyebrow="Our Approach" title="Principles behind our work" as="h2" />
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
        </section>

        {teamMembers.length > 0 ? (
          <section className="flex flex-col gap-8">
            <SectionHeading eyebrow="Our Team" title="The people behind HUDA" as="h2" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-3 rounded-2xl border border-brand-ink/8 bg-brand-light/30 p-8">
          <SectionHeading eyebrow="Registration" title="Organization details" as="h2" />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-brand-muted">Organization Name</dt>
              <dd className="text-base text-brand-ink">{settings.organization_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-brand-muted">Location</dt>
              <dd className="text-base text-brand-ink">
                {settings.city}, {settings.state}
              </dd>
            </div>
            {settings.registration_number ? (
              <div>
                <dt className="text-sm font-medium text-brand-muted">Registration Number</dt>
                <dd className="text-base text-brand-ink">{settings.registration_number}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      </Container>
    </>
  );
}
