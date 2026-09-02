import type { LucideIcon } from "lucide-react";
import { Handshake, Scale, BookOpenCheck, Users, ShieldCheck, Target } from "lucide-react";
import type { GalleryCategory, ProgramCategory } from "@/types/database";
import { FOCUS_AREAS } from "@/lib/focus-areas";

export { FOCUS_AREAS } from "@/lib/focus-areas";
export type { FocusArea, FocusAreaSlug } from "@/lib/focus-areas";

export const SITE_NAME = "HUDA Welfare & Educational Multipurpose Society";
export const SITE_SHORT_NAME = "HUDA";

export const DEFAULT_SITE_SETTINGS = {
  organization_name: SITE_NAME,
  short_name: SITE_SHORT_NAME,
  tagline:
    "Working across education, healthcare, skills, empowerment and community development to help create meaningful opportunities for people and communities.",
  registration_number: null,
  address: null,
  city: "Hinganghat",
  state: "Maharashtra",
  postal_code: null,
  phone: null,
  whatsapp: null,
  email: null,
  facebook: null,
  instagram: null,
  youtube: null,
  linkedin: null,
  google_maps_url: null,
  mission:
    "To strengthen communities by improving access to education, healthcare awareness, skills, opportunities and social support through practical, inclusive and responsible initiatives.",
  vision:
    "To build informed, healthy, skilled and empowered communities where people have greater awareness, opportunities and support to improve their lives.",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
  { href: "/programs", label: "Programs" },
  { href: "/resources", label: "Resources" },
  { href: "/gallery", label: "Gallery" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Program categories, gallery categories and volunteer interest areas all
 * share the same six pillars (see src/lib/focus-areas.ts) plus a catch-all
 * "Other" — derived here once so the labels shown across the site, the
 * admin forms and the form-validation schemas can never drift apart.
 */
export const PROGRAM_CATEGORIES: { value: ProgramCategory; label: string }[] =
  [
    ...FOCUS_AREAS.map((area) => ({ value: area.slug, label: area.title })),
    { value: "other" as const, label: "Other" },
  ];

export const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] =
  PROGRAM_CATEGORIES;

export const VOLUNTEER_AREAS = [
  ...FOCUS_AREAS.map((area) => area.title),
  "Other",
] as unknown as [string, ...string[]];

export interface ApproachPrinciple {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const APPROACH_PRINCIPLES: ApproachPrinciple[] = [
  {
    title: "Community First",
    description:
      "Every initiative starts by listening to and involving the local community it is meant to serve.",
    icon: Handshake,
  },
  {
    title: "Equal Opportunity",
    description:
      "Our programs are open to all sections of society, without discrimination.",
    icon: Scale,
  },
  {
    title: "Education & Awareness",
    description:
      "We believe informed communities are empowered communities, so awareness is built into everything we do.",
    icon: BookOpenCheck,
  },
  {
    title: "Collaboration",
    description:
      "We aim to work alongside volunteers, well-wishers and local institutions rather than in isolation.",
    icon: Users,
  },
  {
    title: "Transparency",
    description:
      "Our activities, reports and outcomes are documented and shared openly as programs are conducted.",
    icon: ShieldCheck,
  },
  {
    title: "Long-Term Impact",
    description:
      "We focus on sustained, meaningful change rather than one-time gestures.",
    icon: Target,
  },
];
