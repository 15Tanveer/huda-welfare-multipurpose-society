import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { getNextUpcomingProgram, getRecentCompletedPrograms } from "@/lib/data/programs";
import { HeroSection } from "@/components/home/HeroSection";
import { WhoWeAreSection } from "@/components/home/WhoWeAreSection";
import { FocusAreaSection } from "@/components/home/FocusAreaSection";
import { UpcomingProgramSection } from "@/components/home/UpcomingProgramSection";
import { MissionVisionSection } from "@/components/home/MissionVisionSection";
import { OurApproachSection } from "@/components/home/OurApproachSection";
import { GetInvolvedSection } from "@/components/home/GetInvolvedSection";
import { RecentProgramsSection } from "@/components/home/RecentProgramsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.organization_name}`,
    description:
      settings.tagline ??
      "A community welfare and educational organization based in Hinganghat, Maharashtra.",
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [settings, upcomingProgram, recentPrograms] = await Promise.all([
    getSiteSettings(),
    getNextUpcomingProgram(),
    getRecentCompletedPrograms(3),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      <WhoWeAreSection settings={settings} />
      <FocusAreaSection />
      <UpcomingProgramSection program={upcomingProgram} />
      <MissionVisionSection settings={settings} />
      <OurApproachSection />
      <GetInvolvedSection />
      <RecentProgramsSection programs={recentPrograms} />
      <NewsletterSection />
    </>
  );
}
