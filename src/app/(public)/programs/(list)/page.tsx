import type { Metadata } from "next";
import Link from "next/link";
import { getPastPrograms, getUpcomingPrograms } from "@/lib/data/programs";
import { PROGRAM_CATEGORIES } from "@/lib/constants";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ProgramGrid } from "@/components/programs/ProgramGrid";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Upcoming and past community programs by HUDA Welfare & Educational Multipurpose Society, Hinganghat.",
  alternates: { canonical: "/programs" },
};

interface ProgramsPageProps {
  searchParams: Promise<{ tab?: string; category?: string }>;
}

export default async function ProgramsPage({ searchParams }: ProgramsPageProps) {
  const params = await searchParams;
  const tab = params.tab === "past" ? "past" : "upcoming";
  const category = params.category;

  const [upcoming, past] = await Promise.all([getUpcomingPrograms(), getPastPrograms()]);
  const activeList = tab === "past" ? past : upcoming;
  const filtered = category ? activeList.filter((p) => p.category === category) : activeList;

  function tabHref(nextTab: "upcoming" | "past") {
    const qs = new URLSearchParams();
    qs.set("tab", nextTab);
    if (category) qs.set("category", category);
    return `/programs?${qs.toString()}`;
  }

  function categoryHref(value?: string) {
    const qs = new URLSearchParams();
    qs.set("tab", tab);
    if (value) qs.set("category", value);
    return `/programs?${qs.toString()}`;
  }

  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="HUDA community programs"
        description="Explore what HUDA is planning and, over time, what we have completed."
      />

      <Container className="flex flex-col gap-8 py-16 sm:py-20">
        <div className="flex flex-col gap-6">
          <div
            role="tablist"
            aria-label="Program status"
            className="inline-flex w-fit rounded-full border border-brand-ink/10 bg-white p-1"
          >
            <Link
              href={tabHref("upcoming")}
              role="tab"
              aria-selected={tab === "upcoming"}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "upcoming" ? "bg-brand-deep text-white" : "text-brand-ink/70"
              }`}
            >
              Upcoming ({upcoming.length})
            </Link>
            <Link
              href={tabHref("past")}
              role="tab"
              aria-selected={tab === "past"}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "past" ? "bg-brand-deep text-white" : "text-brand-ink/70"
              }`}
            >
              Past ({past.length})
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={categoryHref(undefined)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                !category ? "bg-brand-light text-brand-deep" : "text-brand-muted hover:bg-brand-light/60"
              }`}
            >
              All Categories
            </Link>
            {PROGRAM_CATEGORIES.map((c) => (
              <Link
                key={c.value}
                href={categoryHref(c.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  category === c.value
                    ? "bg-brand-light text-brand-deep"
                    : "text-brand-muted hover:bg-brand-light/60"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <ProgramGrid
          programs={filtered}
          emptyTitle={
            tab === "upcoming" ? "No upcoming programs right now" : "No completed programs yet"
          }
          emptyDescription={
            tab === "upcoming"
              ? "New community initiatives will be announced soon."
              : "HUDA hasn't completed a community program yet. Our first one is being planned — check the Upcoming tab."
          }
        />
      </Container>
    </>
  );
}
