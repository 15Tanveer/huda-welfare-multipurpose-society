import type { Metadata } from "next";
import Link from "next/link";
import { getPastPrograms, getUpcomingPrograms } from "@/lib/data/programs";
import { PROGRAM_CATEGORIES } from "@/lib/constants";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { StickyFilterBar } from "@/components/ui/StickyFilterBar";
import { ChipScroller, subChipClasses } from "@/components/ui/ChipScroller";
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
  const category = params.category;

  const [upcoming, past] = await Promise.all([getUpcomingPrograms(), getPastPrograms()]);

  // A visitor who picked a tab keeps it, empty or not. With no choice in
  // the URL the page opens on Upcoming — unless there is nothing
  // upcoming and there are completed programs, in which case landing on
  // an empty tab would hide the work that is actually there.
  const chosenTab = params.tab === "past" || params.tab === "upcoming" ? params.tab : null;
  const tab = chosenTab ?? (upcoming.length === 0 && past.length > 0 ? "past" : "upcoming");
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

      <StickyFilterBar>
        <ChipScroller label="Program status" role="tablist">
          <div className="inline-flex shrink-0 rounded-full border border-brand-ink/10 bg-white p-1">
            <Link
              href={tabHref("upcoming")}
              role="tab"
              aria-selected={tab === "upcoming"}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "upcoming" ? "bg-brand-deep text-white" : "text-brand-ink/70"
              }`}
            >
              Upcoming ({upcoming.length})
            </Link>
            <Link
              href={tabHref("past")}
              role="tab"
              aria-selected={tab === "past"}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "past" ? "bg-brand-deep text-white" : "text-brand-ink/70"
              }`}
            >
              Past ({past.length})
            </Link>
          </div>
        </ChipScroller>

        <ChipScroller label="Filter programs by category">
          <Link href={categoryHref(undefined)} className={subChipClasses(!category)}>
            All Categories
          </Link>
          {PROGRAM_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={categoryHref(c.value)}
              className={subChipClasses(category === c.value)}
            >
              {c.label}
            </Link>
          ))}
        </ChipScroller>
      </StickyFilterBar>

      <Container className="flex flex-col gap-8 py-8 sm:py-12">
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
