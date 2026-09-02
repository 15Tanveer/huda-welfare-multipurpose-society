import type { SVGProps } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/icons/SocialIcons";
import type { SiteSettings } from "@/types";

interface SocialLinksProps {
  settings: SiteSettings;
  className?: string;
}

export function SocialLinks({ settings, className = "" }: SocialLinksProps) {
  const links = [
    { href: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: settings.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  ].filter(
    (l): l is { href: string; label: string; Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element } =>
      Boolean(l.href)
  );

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${settings.short_name} on ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/20 text-brand-deep transition-colors hover:bg-brand-light"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
