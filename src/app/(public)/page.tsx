import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { getNextUpcomingProgram, getRecentCompletedPrograms } from "@/lib/data/programs";
import { getFeaturedResources } from "@/lib/data/resources";
import { HeroSection } from "@/components/home/HeroSection";
import { WhoWeAreSection } from "@/components/home/WhoWeAreSection";
import { FocusAreaSection } from "@/components/home/FocusAreaSection";
import { ResourcesSection } from "@/components/home/ResourcesSection";
import { UpcomingProgramSection } from "@/components/home/UpcomingProgramSection";
import { MissionVisionSection } from "@/components/home/MissionVisionSection";
import { OurApproachSection } from "@/components/home/OurApproachSection";
import { GetInvolvedSection } from "@/components/home/GetInvolvedSection";
import { RecentProgramsSection } from "@/components/home/RecentProgramsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    // `absolute` skips the root layout's `%s | HUDA` title template —
    // without it this becomes "HUDA ... | HUDA" (the org's own short
    // name appended to its own full name).
    title: { absolute: `${settings.organization_name} | ${settings.city}` },
    description: `${settings.short_name} is a community-focused organization in ${settings.city} working across education, healthcare, skills, empowerment, social welfare and community development.`,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [settings, upcomingProgram, recentPrograms, featuredResources] = await Promise.all([
    getSiteSettings(),
    getNextUpcomingProgram(),
    getRecentCompletedPrograms(3),
    getFeaturedResources(3),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      <WhoWeAreSection settings={settings} />
      <FocusAreaSection />
      <ResourcesSection resources={featuredResources} />
      <UpcomingProgramSection program={upcomingProgram} />
      <MissionVisionSection settings={settings} />
      <OurApproachSection />
      <GetInvolvedSection />
      <RecentProgramsSection programs={recentPrograms} />
      <NewsletterSection />
    </>
  );
}
