import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-brand-ink/8 bg-white p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-deep">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-2xl font-semibold text-brand-ink">{value}</p>
        <p className="text-sm text-brand-muted">{label}</p>
      </div>
    </div>
  );
}
