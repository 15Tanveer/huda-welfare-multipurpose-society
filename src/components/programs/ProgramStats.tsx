import { HandHeart, UserCheck, Users } from "lucide-react";
import type { ProgramRow } from "@/types/database";

export function ProgramStats({ program }: { program: ProgramRow }) {
  const stats = [
    { value: program.participant_count, label: "Participants", icon: UserCheck },
    { value: program.volunteer_count, label: "Volunteers", icon: Users },
    { value: program.beneficiary_count, label: "Beneficiaries", icon: HandHeart },
  ].filter((s): s is { value: number; label: string; icon: typeof Users } => s.value !== null);

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ value, label, icon: Icon }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-brand-ink/8 bg-brand-light/30 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-deep">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xl font-semibold text-brand-ink">{value}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
