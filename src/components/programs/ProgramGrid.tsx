import type { ProgramRow } from "@/types/database";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarClock } from "lucide-react";

export function ProgramGrid({
  programs,
  emptyTitle,
  emptyDescription,
}: {
  programs: ProgramRow[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (programs.length === 0) {
    return (
      <EmptyState icon={CalendarClock} title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}
