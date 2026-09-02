-- HUDA Welfare & Educational Multipurpose Society
-- Initial schema: programs, program_gallery, gallery, team_members,
-- volunteer_submissions, contact_submissions, newsletter_subscribers,
-- site_settings.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- programs
-- ---------------------------------------------------------------------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  date date not null,
  start_time time null,
  end_time time null,
  venue text null,
  address text null,
  city text not null default 'Hinganghat',
  category text not null default 'community-welfare',
  cover_image text null,
  status text not null default 'upcoming',
  registration_link text null,
  featured boolean not null default false,
  summary text null,
  objectives text null,
  activities text null,
  outcomes text null,
  participant_count integer null,
  volunteer_count integer null,
  beneficiary_count integer null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint programs_status_check
    check (status in ('upcoming', 'completed', 'cancelled')),
  constraint programs_category_check
    check (category in (
      'education', 'healthcare', 'skill-development',
      'women-empowerment', 'social-awareness', 'community-welfare', 'other'
    )),
  constraint programs_counts_non_negative check (
    (participant_count is null or participant_count >= 0) and
    (volunteer_count is null or volunteer_count >= 0) and
    (beneficiary_count is null or beneficiary_count >= 0)
  )
);

create index programs_status_date_idx on public.programs (status, date desc);
create index programs_slug_idx on public.programs (slug);
create index programs_featured_idx on public.programs (featured) where featured = true;

create trigger programs_set_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- program_gallery (photos attached to a specific program/report)
-- ---------------------------------------------------------------------
create table public.program_gallery (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  image_path text not null,
  caption text null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index program_gallery_program_id_idx on public.program_gallery (program_id, display_order);

-- ---------------------------------------------------------------------
-- gallery (general activity gallery, optionally linked to a program)
-- ---------------------------------------------------------------------
create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text null,
  caption text null,
  category text not null default 'other',
  image_path text not null,
  program_id uuid null references public.programs (id) on delete set null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint gallery_category_check
    check (category in (
      'education', 'healthcare', 'community', 'awareness', 'skill-development', 'other'
    ))
);

create index gallery_category_idx on public.gallery (category);
create index gallery_program_id_idx on public.gallery (program_id);
create index gallery_display_order_idx on public.gallery (display_order, created_at desc);

-- ---------------------------------------------------------------------
-- team_members
-- ---------------------------------------------------------------------
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  designation text null,
  bio text null,
  photo_url text null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index team_members_active_order_idx on public.team_members (is_active, display_order);

create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- volunteer_submissions
-- ---------------------------------------------------------------------
create table public.volunteer_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  city text not null,
  area_of_interest text not null,
  message text null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint volunteer_submissions_status_check
    check (status in ('new', 'contacted', 'archived'))
);

create index volunteer_submissions_created_at_idx on public.volunteer_submissions (created_at desc);
create index volunteer_submissions_status_idx on public.volunteer_submissions (status);

-- ---------------------------------------------------------------------
-- contact_submissions
-- ---------------------------------------------------------------------
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint contact_submissions_status_check
    check (status in ('new', 'read', 'archived'))
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);
create index contact_submissions_status_idx on public.contact_submissions (status);

-- ---------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- site_settings (singleton row, id is always 1)
-- ---------------------------------------------------------------------
create table public.site_settings (
  id smallint primary key default 1,
  organization_name text not null default 'HUDA Welfare & Educational Multipurpose Society',
  short_name text not null default 'HUDA',
  tagline text null,
  registration_number text null,
  address text null,
  city text not null default 'Hinganghat',
  state text not null default 'Maharashtra',
  postal_code text null,
  phone text null,
  whatsapp text null,
  email text null,
  facebook text null,
  instagram text null,
  youtube text null,
  linkedin text null,
  google_maps_url text null,
  mission text null,
  vision text null,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();
