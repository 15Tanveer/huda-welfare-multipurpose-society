import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(4000)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

const optionalCount = z
  .union([z.string(), z.number()])
  .optional()
  .or(z.literal(""))
  .transform((v) => {
    if (v === "" || v === undefined || v === null) return null;
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
  });

export const programFormSchema = z.object({
  title: z.string().trim().min(3, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required.")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens."
    ),
  short_description: z
    .string()
    .trim()
    .min(10, "Short description is required.")
    .max(300),
  description: z.string().trim().min(10, "Description is required.").max(8000),
  date: z.string().trim().min(1, "Date is required."),
  start_time: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  end_time: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  venue: optionalText,
  address: optionalText,
  city: z.string().trim().min(2, "City is required.").max(100),
  category: z.enum(
    [
      "education",
      "healthcare",
      "skill-development",
      "women-empowerment",
      "social-awareness",
      "community-welfare",
      "other",
    ],
    { error: "Please select a category." }
  ),
  status: z.enum(["upcoming", "completed", "cancelled"]),
  registration_link: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  featured: z.boolean().optional().default(false),
  summary: optionalText,
  objectives: optionalText,
  activities: optionalText,
  outcomes: optionalText,
  participant_count: optionalCount,
  volunteer_count: optionalCount,
  beneficiary_count: optionalCount,
});

export type ProgramFormInput = z.infer<typeof programFormSchema>;

export const teamMemberFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(150),
  role: z.string().trim().min(2, "Role is required.").max(150),
  designation: z
    .string()
    .trim()
    .max(150)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  bio: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  display_order: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === "") return 0;
      const n = typeof v === "string" ? Number(v) : v;
      return Number.isFinite(n) ? Math.round(n) : 0;
    }),
  is_active: z.boolean().optional().default(true),
});

export type TeamMemberFormInput = z.infer<typeof teamMemberFormSchema>;

export const galleryFormSchema = z.object({
  title: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  caption: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  category: z.enum([
    "education",
    "healthcare",
    "community",
    "awareness",
    "skill-development",
    "other",
  ]),
  program_id: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export type GalleryFormInput = z.infer<typeof galleryFormSchema>;

export const siteSettingsFormSchema = z.object({
  organization_name: z.string().trim().min(3).max(200),
  short_name: z.string().trim().min(2).max(50),
  tagline: optionalText,
  registration_number: optionalText,
  address: optionalText,
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postal_code: optionalText,
  phone: optionalText,
  whatsapp: optionalText,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  facebook: optionalText,
  instagram: optionalText,
  youtube: optionalText,
  linkedin: optionalText,
  google_maps_url: optionalText,
  mission: optionalText,
  vision: optionalText,
});

export type SiteSettingsFormInput = z.infer<typeof siteSettingsFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;
