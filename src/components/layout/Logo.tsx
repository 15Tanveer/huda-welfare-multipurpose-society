import Link from "next/link";
import { LogoMark } from "@/components/icons/LogoMark";

interface LogoProps {
  shortName?: string;
  /**
   * "mark" (default) — compact ring+monogram badge next to a separate,
   * crisply-scalable text lockup. Not currently used by any page, kept
   * as a lighter-weight option for a future tight-space placement.
   * "full" — the complete circular badge (public/branding/logo.svg),
   * with the wordmark and subtitle baked into the artwork. Used in both
   * the header and footer, so the same official asset appears everywhere.
   */
  variant?: "mark" | "full";
}

export function Logo({ shortName = "HUDA", variant = "mark" }: LogoProps) {
  if (variant === "full") {
    return (
      <Link
        href="/"
        className="flex items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local
            static SVG; next/image's optimizer rejects SVG unless
            images.dangerouslyAllowSVG is set, which isn't needed here */}
        <img
          src="/branding/logo.svg"
          alt={`${shortName} Welfare & Educational Multipurpose Society`}
          className="h-12 w-12 sm:h-14 sm:w-14"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-deep text-white">
        <LogoMark className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight text-brand-deep">
          {shortName}
        </span>
        <span className="hidden text-[11px] font-medium uppercase tracking-wide text-brand-muted sm:block">
          Welfare &amp; Educational Society
        </span>
      </span>
    </Link>
  );
}
