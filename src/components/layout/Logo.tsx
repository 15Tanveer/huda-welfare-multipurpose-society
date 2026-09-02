import Link from "next/link";
import { LogoMark } from "@/components/icons/LogoMark";

export function Logo({ shortName = "HUDA" }: { shortName?: string }) {
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
