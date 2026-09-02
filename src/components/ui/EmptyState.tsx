import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon = Info, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand/25 bg-brand-light/30 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand shadow-sm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="flex max-w-md flex-col gap-1.5">
        <p className="text-lg font-semibold text-brand-ink">{title}</p>
        <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
