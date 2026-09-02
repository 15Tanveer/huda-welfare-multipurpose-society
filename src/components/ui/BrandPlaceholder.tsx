import { HandHeart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Tasteful abstract placeholder used wherever a real photograph doesn't
 * exist yet (a program has no cover image, etc). Never a stock photo —
 * see content rules in README.
 */
export function BrandPlaceholder({
  icon: Icon = HandHeart,
  className = "",
}: {
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={`leaf-pattern relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-deep via-brand to-brand-deep ${className}`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
        <Icon className="h-7 w-7 text-white" aria-hidden="true" />
      </span>
    </div>
  );
}
