export function formatProgramDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatProgramDateShort(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTimeRange(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  const format = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  };
  if (start && end) return `${format(start)} – ${format(end)}`;
  return format((start ?? end) as string);
}

export function formatSubmittedAt(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Formats an ISO timestamp as "2 September 2026" — used for Resources'
 * "Last verified" and "Application deadline" display. */
export function formatIsoDateLong(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Plain (non-component) helper so the `Date.now()` call doesn't happen
 * directly inside a component body, which React's purity lint rule flags
 * as an impure render.
 */
export function isPastDeadline(isoStr: string): boolean {
  return new Date(isoStr).getTime() < Date.now();
}
