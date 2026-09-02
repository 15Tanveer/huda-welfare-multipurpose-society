export type {
  ProgramRow as Program,
  ProgramStatus,
  ProgramCategory,
  ProgramGalleryRow as ProgramGalleryItem,
  GalleryRow as GalleryItem,
  GalleryCategory,
  TeamMemberRow as TeamMember,
  VolunteerSubmissionRow as VolunteerSubmission,
  ContactSubmissionRow as ContactSubmission,
  SubmissionStatus,
} from "./database";

/**
 * Site settings as used throughout the app. Always has safe, non-fake
 * fallback values so the UI can render before Supabase is configured or
 * before an admin has filled in real organization details. Optional
 * fields are `null` when not configured and must be hidden in the UI,
 * never replaced with placeholder text.
 */
export interface SiteSettings {
  organization_name: string;
  short_name: string;
  tagline: string | null;
  registration_number: string | null;
  address: string | null;
  city: string;
  state: string;
  postal_code: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
  google_maps_url: string | null;
  mission: string | null;
  vision: string | null;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
}
