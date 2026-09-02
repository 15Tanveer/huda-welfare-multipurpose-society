import { z } from "zod";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_SCOPES,
  RESOURCE_STATUSES,
  RESOURCE_TYPES,
} from "@/lib/resources-config";
import type { ResourceCategory, ResourceKind, ResourceScope, ResourceStatus } from "@/types/database";

const CATEGORY_VALUES = RESOURCE_CATEGORIES.map((c) => c.value) as unknown as [
  ResourceCategory,
  ...ResourceCategory[],
];
const TYPE_VALUES = RESOURCE_TYPES.map((t) => t.value) as unknown as [
  ResourceKind,
  ...ResourceKind[],
];
const SCOPE_VALUES = RESOURCE_SCOPES.map((s) => s.value) as unknown as [
  ResourceScope,
  ...ResourceScope[],
];
const STATUS_VALUES = RESOURCE_STATUSES.map((s) => s.value) as unknown as [
  ResourceStatus,
  ...ResourceStatus[],
];

const optionalText = z
  .string()
  .trim()
  .max(4000)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

/** `datetime-local` / `date` input values ("" or "2026-09-20[T10:00]") to ISO, or null. */
const optionalDateTime = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? new Date(v).toISOString() : null));

export const resourceFormSchema = z.object({
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
  resource_type: z.enum(TYPE_VALUES, { error: "Please select a resource type." }),
  category: z.enum(CATEGORY_VALUES, { error: "Please select a category." }),
  short_description: z
    .string()
    .trim()
    .min(10, "Short description is required.")
    .max(300),
  description: optionalText,
  audience: optionalText,
  eligibility: optionalText,
  benefits: optionalText,
  documents_required: optionalText,
  how_to_apply: optionalText,
  important_notes: optionalText,
  provided_by: optionalText,
  official_url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^https?:\/\//.test(v), {
      error: "Official link must start with http:// or https://",
    }),
  scope: z.enum(SCOPE_VALUES, { error: "Please select a scope." }),
  state: optionalText,
  application_deadline: optionalDateTime,
  last_verified_at: optionalDateTime,
  featured: z.boolean().optional().default(false),
  status: z.enum(STATUS_VALUES, { error: "Please select a status." }),
});

export type ResourceFormInput = z.infer<typeof resourceFormSchema>;
