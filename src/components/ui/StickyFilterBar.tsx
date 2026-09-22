import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/**
 * The filter bar that sits directly under the page hero and stays pinned
 * below the site header while the results scroll past.
 *
 * `--header-h` is published by the Header as it resizes (it shrinks on
 * scroll), so this stays flush against it instead of relying on a
 * hard-coded offset that only matches one of the two header heights.
 */
export function StickyFilterBar({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ top: "var(--header-h)" }}
      className="sticky z-30 border-b border-brand-ink/8 bg-brand-off-white/95 backdrop-blur"
    >
      <Container className={`flex flex-col gap-2 py-3 ${className}`}>{children}</Container>
    </div>
  );
}
