/**
 * Hand-written mirror of the Supabase schema in supabase/migrations.
 * Keep in sync manually, or regenerate with:
 *   pnpm dlx supabase gen types typescript --project-id <id> > src/types/database.ts
 *
 * NOTE: these must be `type` aliases, not `interface` declarations.
 * TypeScript's structural checks against index-signature types (like the
 * `Record<string, GenericTable>` constraint @supabase/supabase-js uses)
 * only succeed for plain object type aliases — an `interface` never
 * satisfies that check, which otherwise silently collapses every table's
 * Row/Insert/Update type to `never`.
 */

export type ProgramStatus = "upcoming" | "completed" | "cancelled";

/**
 * The six FocusAreaSlug values (see src/lib/focus-areas.ts) plus "other".
 * Not imported directly from focus-areas.ts to avoid a client-facing
 * database type depending on a module that also pulls in lucide-react
 * icon components — kept in sync manually, matching the "hand-written
 * mirror" convention of this whole file.
 */
export type ProgramCategory =
  | "education-career"
  | "healthcare-wellness"
  | "youth-skills-employment"
  | "women-child-empowerment"
  | "community-rural-development"
  | "environment-social-awareness"
  | "other";

/** Gallery photos use the same six pillars as programs, plus "other". */
export type GalleryCategory = ProgramCategory;

export type SubmissionStatus = "new" | "contacted" | "read" | "archived";

export type ProgramRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  address: string | null;
  city: string;
  category: ProgramCategory;
  cover_image: string | null;
  status: ProgramStatus;
  registration_link: string | null;
  featured: boolean;
  summary: string | null;
  objectives: string | null;
  activities: string | null;
  outcomes: string | null;
  participant_count: number | null;
  volunteer_count: number | null;
  beneficiary_count: number | null;
  created_at: string;
  updated_at: string;
};

export type ProgramInsert = Omit<
  ProgramRow,
  "id" | "created_at" | "updated_at"
> &
  Partial<Pick<ProgramRow, "id" | "created_at" | "updated_at">>;

export type ProgramUpdate = Partial<ProgramInsert>;

export type ProgramGalleryRow = {
  id: string;
  program_id: string;
  image_path: string;
  caption: string | null;
  display_order: number;
  created_at: string;
};

export type ProgramGalleryInsert = Omit<
  ProgramGalleryRow,
  "id" | "created_at" | "display_order"
> &
  Partial<Pick<ProgramGalleryRow, "id" | "created_at" | "display_order">>;

export type GalleryRow = {
  id: string;
  title: string | null;
  caption: string | null;
  category: GalleryCategory;
  image_path: string;
  program_id: string | null;
  display_order: number;
  created_at: string;
};

export type GalleryInsert = Omit<
  GalleryRow,
  "id" | "created_at" | "display_order"
> &
  Partial<Pick<GalleryRow, "id" | "created_at" | "display_order">>;

export type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  designation: string | null;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMemberInsert = Omit<
  TeamMemberRow,
  "id" | "created_at" | "updated_at"
> &
  Partial<Pick<TeamMemberRow, "id" | "created_at" | "updated_at">>;

export type TeamMemberUpdate = Partial<TeamMemberInsert>;

export type VolunteerSubmissionRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  area_of_interest: string;
  message: string | null;
  status: SubmissionStatus;
  created_at: string;
};

export type VolunteerSubmissionInsert = Omit<
  VolunteerSubmissionRow,
  "id" | "created_at" | "status"
> &
  Partial<Pick<VolunteerSubmissionRow, "id" | "created_at" | "status">>;

export type ContactSubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: SubmissionStatus;
  created_at: string;
};

export type ContactSubmissionInsert = Omit<
  ContactSubmissionRow,
  "id" | "created_at" | "status"
> &
  Partial<Pick<ContactSubmissionRow, "id" | "created_at" | "status">>;

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  created_at: string;
};

export type SiteSettingsRow = {
  id: number;
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
  updated_at: string;
};

export type SiteSettingsUpdate = Partial<
  Omit<SiteSettingsRow, "id" | "updated_at">
>;

/**
 * Category/type/scope/status literal unions live in
 * src/lib/resources-config.ts (the single source of truth also used by
 * the Zod schema, admin form and public filters) — re-exported here as
 * plain type aliases so this file's own "hand-written mirror" convention
 * holds without importing lucide-react-adjacent config into the type
 * layer twice.
 */
export type ResourceCategory =
  | "education-scholarships"
  | "skills-employment"
  | "healthcare-welfare"
  | "women-child-support"
  | "agriculture-rural-development"
  | "social-welfare"
  | "other-opportunities";

export type ResourceKind =
  | "government-scheme"
  | "scholarship"
  | "training-program"
  | "employment-opportunity"
  | "education-opportunity"
  | "health-resource"
  | "community-resource"
  | "other";

export type ResourceScope = "central" | "maharashtra" | "other";

export type ResourceStatus = "active" | "needs-verification" | "archived";

export type ResourceRow = {
  id: string;
  title: string;
  slug: string;
  resource_type: ResourceKind;
  category: ResourceCategory;
  short_description: string;
  description: string | null;
  audience: string | null;
  eligibility: string | null;
  benefits: string | null;
  documents_required: string | null;
  how_to_apply: string | null;
  important_notes: string | null;
  provided_by: string | null;
  official_url: string | null;
  scope: ResourceScope;
  state: string | null;
  application_deadline: string | null;
  last_verified_at: string | null;
  featured: boolean;
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
};

export type ResourceInsert = Omit<
  ResourceRow,
  "id" | "created_at" | "updated_at"
> &
  Partial<Pick<ResourceRow, "id" | "created_at" | "updated_at">>;

export type ResourceUpdate = Partial<ResourceInsert>;

export type Database = {
  public: {
    Tables: {
      programs: {
        Row: ProgramRow;
        Insert: ProgramInsert;
        Update: ProgramUpdate;
        Relationships: [];
      };
      program_gallery: {
        Row: ProgramGalleryRow;
        Insert: ProgramGalleryInsert;
        Update: Partial<ProgramGalleryInsert>;
        Relationships: [];
      };
      gallery: {
        Row: GalleryRow;
        Insert: GalleryInsert;
        Update: Partial<GalleryInsert>;
        Relationships: [];
      };
      team_members: {
        Row: TeamMemberRow;
        Insert: TeamMemberInsert;
        Update: TeamMemberUpdate;
        Relationships: [];
      };
      volunteer_submissions: {
        Row: VolunteerSubmissionRow;
        Insert: VolunteerSubmissionInsert;
        Update: Partial<VolunteerSubmissionInsert>;
        Relationships: [];
      };
      contact_submissions: {
        Row: ContactSubmissionRow;
        Insert: ContactSubmissionInsert;
        Update: Partial<ContactSubmissionInsert>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: Omit<NewsletterSubscriberRow, "id" | "created_at"> &
          Partial<Pick<NewsletterSubscriberRow, "id" | "created_at">>;
        Update: Partial<NewsletterSubscriberRow>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: Partial<SiteSettingsRow>;
        Update: SiteSettingsUpdate;
        Relationships: [];
      };
      resources: {
        Row: ResourceRow;
        Insert: ResourceInsert;
        Update: ResourceUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
