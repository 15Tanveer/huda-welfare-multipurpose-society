-- Resources & Opportunities: HUDA's curated awareness/guidance directory
-- of government schemes, scholarships, training and employment
-- opportunities, health/welfare resources and rural/agriculture
-- programs. HUDA does not own, administer or guarantee any of these —
-- see the disclaimers rendered on every public resources page.

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  resource_type text not null,
  category text not null,
  short_description text not null,
  description text null,
  audience text null,
  eligibility text null,
  benefits text null,
  documents_required text null,
  how_to_apply text null,
  important_notes text null,
  provided_by text null,
  official_url text null,
  scope text not null default 'maharashtra',
  state text null,
  application_deadline timestamptz null,
  last_verified_at timestamptz null,
  featured boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_type_check
    check (resource_type in (
      'government-scheme', 'scholarship', 'training-program',
      'employment-opportunity', 'education-opportunity',
      'health-resource', 'community-resource', 'other'
    )),
  constraint resources_category_check
    check (category in (
      'education-scholarships', 'skills-employment', 'healthcare-welfare',
      'women-child-support', 'agriculture-rural-development',
      'social-welfare', 'other-opportunities'
    )),
  constraint resources_scope_check
    check (scope in ('central', 'maharashtra', 'other')),
  constraint resources_status_check
    check (status in ('active', 'needs-verification', 'archived'))
);

-- Public listing/filtering: status is checked on every public query, and
-- almost always alongside category; the featured-carousel query adds
-- status = 'active' too, covered by the same composite index left-to-right.
create index resources_status_category_idx on public.resources (status, category);
create index resources_slug_idx on public.resources (slug);
create index resources_featured_idx on public.resources (featured) where status = 'active';

create trigger resources_set_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS: public can read only active resources; admin (any authenticated
-- user, same model as every other table — see 0002_rls.sql) has full
-- read/write access including drafts and archived entries.
--
-- No explicit GRANTs are needed here: 0003_grants.sql already runs
-- `alter default privileges ... grant ... on tables to anon,
-- authenticated` for every table created afterwards in this schema, so
-- this new table inherits the same baseline privileges automatically.
-- ---------------------------------------------------------------------
alter table public.resources enable row level security;

create policy "resources_public_read_active"
  on public.resources for select
  to anon, authenticated
  using (status = 'active');

create policy "resources_admin_all"
  on public.resources for all
  to authenticated
  using (true)
  with check (true);
