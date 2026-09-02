import type { SVGProps } from "react";

/**
 * Compact HUDA crest — the same ring motif as the full circular logo
 * (public/branding/logo.svg), reduced to an icon-only monogram for the
 * small badge squares in the header, footer, and admin login. Ring and
 * monogram use currentColor so they read as white against the deep-green
 * badge background used everywhere this appears; the accent ring is the
 * brand gold.
 */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="5" />
      <circle cx="50" cy="50" r="35" stroke="#C9A227" strokeWidth="2" />
      <text
        x="50"
        y="65"
        textAnchor="middle"
        fontFamily="Manrope, Inter, Arial, sans-serif"
        fontWeight="800"
        fontSize="40"
        fill="currentColor"
        stroke="none"
      >
        H
      </text>
    </svg>
  );
}
