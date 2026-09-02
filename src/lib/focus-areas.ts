import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  HeartPulse,
  Hammer,
  Users,
  HandHeart,
  Leaf,
} from "lucide-react";

/**
 * The six broad pillars HUDA organizes its work around. This is the
 * single source of truth for program categories, gallery categories and
 * volunteer interest areas — see src/lib/constants.ts, which derives all
 * three from this list instead of maintaining separate arrays that could
 * drift out of sync. The `slug` values are also the literal database
 * values stored in `programs.category` / `gallery.category` (see
 * src/types/database.ts and supabase/migrations/0004_recategorize.sql).
 */
export type FocusAreaSlug =
  | "education-career"
  | "healthcare-wellness"
  | "youth-skills-employment"
  | "women-child-empowerment"
  | "community-rural-development"
  | "environment-social-awareness";

export interface FocusArea {
  slug: FocusAreaSlug;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  topics: string[];
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    slug: "education-career",
    title: "Education & Career Development",
    shortTitle: "Education & Career",
    description:
      "Supporting students and families through educational awareness, career guidance, learning opportunities and access to useful resources.",
    icon: GraduationCap,
    topics: [
      "Education awareness",
      "Career guidance",
      "Scholarship awareness",
      "Government education schemes",
      "Competitive exam guidance",
      "Digital learning",
      "Student development",
      "Vocational guidance",
    ],
  },
  {
    slug: "healthcare-wellness",
    title: "Healthcare & Wellness",
    shortTitle: "Healthcare & Wellness",
    description:
      "Promoting healthier communities through health awareness, preventive care initiatives, medical camps and access to reliable health information.",
    icon: HeartPulse,
    topics: [
      "Medical camps",
      "Health check-ups",
      "Preventive healthcare",
      "Health awareness",
      "Community wellness",
      "Rural health awareness",
    ],
  },
  {
    slug: "youth-skills-employment",
    title: "Youth, Skills & Employment",
    shortTitle: "Youth & Skills",
    description:
      "Helping young people build practical skills, confidence and awareness of employment, entrepreneurship and livelihood opportunities.",
    icon: Hammer,
    topics: [
      "Skill development",
      "Digital skills",
      "Vocational training",
      "Job readiness",
      "Entrepreneurship",
      "Self-employment awareness",
      "Government employment schemes",
      "Youth leadership",
    ],
  },
  {
    slug: "women-child-empowerment",
    title: "Women & Child Empowerment",
    shortTitle: "Women & Child",
    description:
      "Supporting education, health, awareness, skills and opportunities that contribute to the development and well-being of women and children.",
    icon: Users,
    topics: [
      "Women's education",
      "Women's health awareness",
      "Skill development",
      "Child welfare",
      "Awareness programs",
      "Economic empowerment",
    ],
  },
  {
    slug: "community-rural-development",
    title: "Community & Rural Development",
    shortTitle: "Community & Rural",
    description:
      "Supporting initiatives that strengthen communities, improve awareness and contribute to inclusive social and rural development.",
    icon: HandHeart,
    topics: [
      "Community welfare",
      "Rural development",
      "Support for vulnerable communities",
      "Agriculture awareness",
      "Farmer awareness",
      "Government schemes",
    ],
  },
  {
    slug: "environment-social-awareness",
    title: "Environment & Social Awareness",
    shortTitle: "Environment & Awareness",
    description:
      "Encouraging responsible communities through environmental awareness, cleanliness, tree plantation and socially meaningful awareness initiatives.",
    icon: Leaf,
    topics: [
      "Environmental awareness",
      "Tree plantation",
      "Cleanliness",
      "Sustainability",
      "Civic awareness",
      "Social awareness",
    ],
  },
];

export function focusAreaTitle(slug: string): string | undefined {
  return FOCUS_AREAS.find((area) => area.slug === slug)?.title;
}
