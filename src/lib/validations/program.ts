import { z } from "zod";
import { FOCUS_AREAS } from "@/lib/focus-areas";
import { safeHttpUrl, youTubeVideoId } from "@/lib/gallery-media";
import type { GalleryInsert, ProgramCategory } from "@/types/database";

const CATEGORY_VALUES = [
  ...FOCUS_AREAS.map((area) => area.slug),
  "other",
] as unknown as [ProgramCategory, ...ProgramCategory[]];

// `.nullable()` matters here beyond the usual "field left blank": the
// Program Report fields (summary/objectives/.../beneficiary_count) only
// render in the DOM when status is "completed" — for any other status,
// `formData.get(name)` returns `null` (not `undefined`) because the input
// doesn't exist at all. Without `.nullable()`, that `null` fails this
// schema outright, which meant creating an "upcoming" or "cancelled"
// program (i.e. anything but "completed") always failed validation.
const optionalText = z
  .string()
  .trim()
  .max(4000)
  .nullable()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

const optionalCount = z
  .union([z.string(), z.number()])
  .nullable()
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
  category: z.enum(CATEGORY_VALUES, { error: "Please select a category." }),
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

/**
 * A link an admin pasted. Stored as a plain URL and never as markup —
 * embeds are generated from it at render time (see @/lib/gallery-media),
 * and anything that isn't http(s) is rejected here.
 */
const optionalHttpUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || safeHttpUrl(v) !== null, {
      error: `${label} must be a valid link starting with http:// or https://`,
    });

const optionalStoragePath = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export const galleryFormSchema = z
  .object({
    // Defaulted so an older form post without the field — and every
    // pre-existing gallery row — is still a valid photo.
    media_type: z
      .enum(["photo", "video", "press"] as const)
      .nullable()
      .optional()
      .transform((v) => v ?? "photo"),
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
    category: z.enum(CATEGORY_VALUES),
    program_id: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .transform((v) => (v ? v : null)),
    /** Photo, newspaper clipping, or a video's cover image. */
    image_path: optionalStoragePath,
    video_url: optionalHttpUrl("Video URL"),
    video_source: z
      .enum(["youtube", "instagram", "facebook", "external"] as const)
      .nullable()
      .optional()
      .transform((v) => v ?? null),
    source_name: z
      .string()
      .trim()
      .max(150)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v ? v : null)),
    coverage_url: optionalHttpUrl("Coverage URL"),
  })
  .superRefine((value, ctx) => {
    const requireTitle = () => {
      if (!value.title) {
        ctx.addIssue({
          code: "custom",
          path: ["title"],
          message: "Title is required for this media type.",
        });
      }
    };

    if (value.media_type === "photo" && !value.image_path) {
      ctx.addIssue({
        code: "custom",
        path: ["image_path"],
        message: "Please upload a photo first.",
      });
      return;
    }

    if (value.media_type === "press") {
      requireTitle();
      if (!value.image_path) {
        ctx.addIssue({
          code: "custom",
          path: ["image_path"],
          message: "Please upload the coverage image (clipping or screenshot).",
        });
      }
      return;
    }

    if (value.media_type === "video") {
      requireTitle();
      if (!value.video_url) {
        ctx.addIssue({
          code: "custom",
          path: ["video_url"],
          message: "Video URL is required.",
        });
        return;
      }
      if (!value.video_source) {
        ctx.addIssue({
          code: "custom",
          path: ["video_source"],
          message: "Please choose where this video is hosted.",
        });
        return;
      }
      // Guard against a source/URL mismatch (e.g. "YouTube" selected
      // with an Instagram link), which would otherwise store a row the
      // player can never embed.
      const host = safeHttpUrl(value.video_url)?.hostname.replace(/^www\./, "").toLowerCase() ?? "";
      if (value.video_source === "youtube" && !youTubeVideoId(value.video_url)) {
        ctx.addIssue({
          code: "custom",
          path: ["video_url"],
          message:
            "That doesn't look like a YouTube link. Use youtube.com/watch?v=…, youtu.be/… or youtube.com/shorts/…",
        });
      }
      if (value.video_source === "instagram" && !host.endsWith("instagram.com")) {
        ctx.addIssue({
          code: "custom",
          path: ["video_url"],
          message: "That doesn't look like an Instagram link.",
        });
      }
      if (
        value.video_source === "facebook" &&
        !host.endsWith("facebook.com") &&
        host !== "fb.watch"
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["video_url"],
          message: "That doesn't look like a Facebook link.",
        });
      }
    }
  });

export type GalleryFormInput = z.infer<typeof galleryFormSchema>;

/**
 * Clears the fields that don't belong to the chosen media type, so
 * switching an item from (say) Video to Photo doesn't leave a stale
 * video URL behind on the row.
 */
export function normalizeGalleryInput(input: GalleryFormInput): GalleryInsert {
  const base = {
    media_type: input.media_type,
    title: input.title,
    caption: input.caption,
    category: input.category,
    program_id: input.program_id,
    image_path: input.image_path,
  };

  if (input.media_type === "video") {
    return {
      ...base,
      video_url: input.video_url,
      video_source: input.video_source,
      source_name: null,
      coverage_url: null,
    };
  }

  if (input.media_type === "press") {
    return {
      ...base,
      video_url: null,
      video_source: null,
      source_name: input.source_name,
      coverage_url: input.coverage_url,
    };
  }

  return {
    ...base,
    video_url: null,
    video_source: null,
    source_name: null,
    coverage_url: null,
  };
}

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
