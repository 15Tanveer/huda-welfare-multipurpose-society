import type { Metadata } from "next";
import {
  Award,
  Building2,
  Compass,
  HeartHandshake,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  ScrollText,
  Target,
  Users,
} from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { APPROACH_PRINCIPLES, FOCUS_AREAS } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "About Us",
    description: `Learn about ${settings.organization_name}, a community-focused organization based in ${settings.city}, ${settings.state} working across education, healthcare, skills, empowerment and community development.`,
    alternates: { canonical: "/about" },
  };
}

/** The organization's registered nature — part of its legal name, not a
 * per-deployment setting, so it isn't stored in site_settings. */
const ORGANIZATION_NATURE = "Welfare & Educational Multipurpose Society";

const OBJECTIVES = [
  "Promote education, career awareness and access to learning opportunities.",
  "Support healthcare awareness, preventive care and community health initiatives.",
  "Develop practical skills and awareness of employment and entrepreneurship opportunities.",
  "Support the education, health, welfare and empowerment of women and children.",
  "Encourage inclusive community and rural development.",
  "Promote environmental responsibility and socially meaningful awareness.",
  "Help communities understand and access relevant public welfare opportunities and schemes.",
  "Encourage collaboration between citizens, professionals, institutions and volunteers.",
];

const VALUES = [
  { icon: HeartHandshake, title: "Compassion", description: "We approach every person and every problem with empathy first." },
  { icon: Users, title: "Inclusion", description: "Our programs are open to everyone, regardless of background." },
  { icon: Award, title: "Integrity", description: "We aim to be honest and transparent in everything we do." },
  { icon: Compass, title: "Accountability", description: "We document and share our work openly as it happens." },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const orgInfo = [
    { label: "Official Name", value: settings.organization_name, icon: Building2 },
    {
      label: "Location",
      value: [settings.city, settings.state].filter(Boolean).join(", "),
      icon: MapPin,
    },
    {
      label: "Registration Number",
      value: settings.registration_number,
      icon: ScrollText,
    },
    { label: "Nature", value: ORGANIZATION_NATURE, icon: Award },
    { label: "Official Address", value: settings.address, icon: MapPin },
    { label: "Email", value: settings.email, icon: Mail },
    { label: "Phone", value: settings.phone, icon: Phone },
  ].filter((field) => field.value);

  return (
    <>
      <PageHero
        eyebrow="About HUDA"
        title={`About ${settings.organization_name}`}
        description={`A community-focused organization based in ${settings.city}, ${settings.state}.`}
      />

      <Container className="flex flex-col gap-20 py-16 sm:py-20">
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading eyebrow="Introduction" title="Who we are" as="h2" />
            <p className="leading-relaxed text-brand-muted">
              {settings.organization_name} is a community-focused organization based in{" "}
              {settings.city}, {settings.state}. HUDA works to support people and
              communities through education, healthcare awareness, skill development,
              empowerment, social welfare, rural development and responsible community
              initiatives.
            </p>
            <p className="leading-relaxed text-brand-muted">
              Our focus is on creating practical programs that improve awareness,
              connect people with opportunities and encourage community participation.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <SectionHeading eyebrow="Why HUDA Exists" title="Bridging awareness and opportunity" as="h2" />
            <p className="leading-relaxed text-brand-muted">
              Many useful opportunities already exist — educational pathways, health
              information, skill-development programs and government schemes — but
              people don&apos;t always have the awareness, guidance or community support
              needed to access them.
            </p>
            <p className="leading-relaxed text-brand-muted">
              HUDA aims to help bridge these gaps through organized initiatives,
              awareness and collaboration, working alongside communities in{" "}
              {settings.city} and beyond.
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
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                {objective}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Our Focus"
            title="Six pillars, one community vision"
            description="Every HUDA initiative falls under one of six broad focus areas."
            as="h2"
          />
          <div className="flex flex-wrap gap-3">
            {FOCUS_AREAS.map(({ slug, title, icon: Icon }) => (
              <span
                key={slug}
                className="inline-flex items-center gap-2 rounded-full border border-brand-ink/8 bg-white px-4 py-2 text-sm font-medium text-brand-ink"
              >
                <Icon className="h-4 w-4 text-brand-deep" aria-hidden="true" />
                {title}
              </span>
            ))}
          </div>
          <Button href="/our-work" variant="outline" size="md" className="self-start">
            Explore Our Work
          </Button>
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

        <section className="flex flex-col gap-6 rounded-2xl border border-brand-ink/8 bg-brand-light/30 p-8 sm:p-10">
          <SectionHeading eyebrow="Organization Information" title="About the organization" as="h2" />
          <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {orgInfo.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-deep">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-muted">{label}</dt>
                  <dd className="mt-0.5 text-base text-brand-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-3xl bg-brand-deep p-10 text-white sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Want to be part of this work?</h2>
          <p className="max-w-xl text-white/80">
            Volunteers, partners and well-wishers all help HUDA reach further into the
            community.
          </p>
          <Button href="/get-involved" size="lg" className="!bg-white !text-brand-deep hover:!bg-brand-light">
            Get Involved
          </Button>
        </section>
      </Container>
    </>
  );
}
