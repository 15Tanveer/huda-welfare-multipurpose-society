import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  HeartPulse,
  Hammer,
  Users,
  Megaphone,
  HandHeart,
  Handshake,
  Scale,
  BookOpenCheck,
  ShieldCheck,
  Target,
} from "lucide-react";
import type { GalleryCategory, ProgramCategory } from "@/types/database";

export const SITE_NAME = "HUDA Welfare & Educational Multipurpose Society";
export const SITE_SHORT_NAME = "HUDA";

export const DEFAULT_SITE_SETTINGS = {
  organization_name: SITE_NAME,
  short_name: SITE_SHORT_NAME,
  tagline:
    "Working together for education, healthcare, empowerment and community welfare.",
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
    "To support community development through education, healthcare awareness, empowerment, skills and socially responsible initiatives.",
  vision:
    "To help build an educated, healthy, skilled and empowered community where people have greater access to opportunities and support.",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
  { href: "/programs", label: "Programs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
] as const;

export interface FocusArea {
  slug: ProgramCategory;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    slug: "education",
    title: "Education & Career Guidance",
    description:
      "Helping students and families access educational guidance, opportunities, awareness and resources.",
    icon: GraduationCap,
  },
  {
    slug: "healthcare",
    title: "Healthcare & Medical Camps",
    description:
      "Supporting preventive healthcare, medical awareness, health camps and access to basic health information.",
    icon: HeartPulse,
  },
  {
    slug: "skill-development",
    title: "Skill Development",
    description:
      "Helping youth and community members develop practical, career-oriented and livelihood skills.",
    icon: Hammer,
  },
  {
    slug: "women-empowerment",
    title: "Women Empowerment",
    description:
      "Supporting awareness, education, skill development and opportunities for women.",
    icon: Users,
  },
  {
    slug: "social-awareness",
    title: "Social Awareness",
    description:
      "Organizing community awareness initiatives around education, health, government schemes and responsible citizenship.",
    icon: Megaphone,
  },
  {
    slug: "community-welfare",
    title: "Community Welfare",
    description:
      "Supporting initiatives that improve the social and economic well-being of local communities.",
    icon: HandHeart,
  },
];

export const PROGRAM_CATEGORIES: { value: ProgramCategory; label: string }[] =
  [
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "skill-development", label: "Skill Development" },
    { value: "women-empowerment", label: "Women Empowerment" },
    { value: "social-awareness", label: "Social Awareness" },
    { value: "community-welfare", label: "Community Welfare" },
    { value: "other", label: "Other" },
  ];

export const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] =
  [
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "community", label: "Community" },
    { value: "awareness", label: "Awareness" },
    { value: "skill-development", label: "Skill Development" },
    { value: "other", label: "Other" },
  ];

export const VOLUNTEER_AREAS = [
  "Education",
  "Healthcare",
  "Skill Development",
  "Women Empowerment",
  "Social Awareness",
  "Community Welfare",
  "Other",
] as const;

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
      "Our activities, reports and outcomes will be documented and shared openly as programs are conducted.",
    icon: ShieldCheck,
  },
  {
    title: "Long-Term Impact",
    description:
      "We focus on sustained, meaningful change rather than one-time gestures.",
    icon: Target,
  },
];
