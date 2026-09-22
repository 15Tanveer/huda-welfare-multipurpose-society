import type { ReactNode } from "react";

/**
 * Standard filter-chip styling, shared by every filter row on the site so
 * the gallery, programs and any future filtered page stay identical.
 */
export function chipClasses(active: boolean) {
  return `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? "bg-brand-deep text-white"
      : "bg-brand-light text-brand-deep hover:bg-brand-light/70"
  }`;
}

/** Smaller variant, for a secondary row under a primary one. */
export function subChipClasses(active: boolean) {
  return `shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
    active ? "bg-brand-light text-brand-deep" : "text-brand-muted hover:bg-brand-light/60"
  }`;
}

/**
 * A single-line, horizontally scrollable row of filter chips.
 *
 * Wrapping filter rows grow several lines tall on a phone and push the
 * content off screen, so chips stay on one line and scroll sideways
 * instead. The negative margins cancel the surrounding container's
 * gutter, letting the row scroll edge to edge rather than stopping short
 * of it, and the padding puts the gutter back for the chips themselves.
 */
export function ChipScroller({
  label,
  role,
  children,
  className = "",
}: {
  label: string;
  /** Pass "tablist" when the chips are real tabs; omit for plain links. */
  role?: "tablist" | "group";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={role ?? "group"}
      aria-label={label}
      className={`no-scrollbar -mx-5 flex items-center gap-2 overflow-x-auto px-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
