-- Row Level Security policies.
--
-- Model: anyone (anon + authenticated) can read public content and submit
-- the three public forms; only authenticated users (HUDA admins — every
-- authenticated Supabase user in this project is treated as an admin,
-- since accounts are created manually, see README) can write content or
-- read form submissions.

alter table public.programs enable row level security;
alter table public.program_gallery enable row level security;
alter table public.gallery enable row level security;
alter table public.team_members enable row level security;
alter table public.volunteer_submissions enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_settings enable row level security;

-- ---------------------------------------------------------------------
-- programs: public read, admin write
-- ---------------------------------------------------------------------
create policy "programs_public_read"
  on public.programs for select
  to anon, authenticated
  using (true);

create policy "programs_admin_write"
  on public.programs for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- program_gallery: public read, admin write
-- ---------------------------------------------------------------------
create policy "program_gallery_public_read"
  on public.program_gallery for select
  to anon, authenticated
  using (true);

create policy "program_gallery_admin_write"
  on public.program_gallery for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- gallery: public read, admin write
-- ---------------------------------------------------------------------
create policy "gallery_public_read"
  on public.gallery for select
  to anon, authenticated
  using (true);

create policy "gallery_admin_write"
  on public.gallery for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- team_members: public read of active members only, admin full read/write
-- ---------------------------------------------------------------------
create policy "team_members_public_read_active"
  on public.team_members for select
  to anon, authenticated
  using (is_active = true);

create policy "team_members_admin_all"
  on public.team_members for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- volunteer_submissions: public can insert only; admin can read/write
-- ---------------------------------------------------------------------
create policy "volunteer_submissions_public_insert"
  on public.volunteer_submissions for insert
  to anon, authenticated
  with check (true);

create policy "volunteer_submissions_admin_read"
  on public.volunteer_submissions for select
  to authenticated
  using (true);

create policy "volunteer_submissions_admin_update"
  on public.volunteer_submissions for update
  to authenticated
  using (true)
  with check (true);

create policy "volunteer_submissions_admin_delete"
  on public.volunteer_submissions for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- contact_submissions: public can insert only; admin can read/write
-- ---------------------------------------------------------------------
create policy "contact_submissions_public_insert"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "contact_submissions_admin_read"
  on public.contact_submissions for select
  to authenticated
  using (true);

create policy "contact_submissions_admin_update"
  on public.contact_submissions for update
  to authenticated
  using (true)
  with check (true);

create policy "contact_submissions_admin_delete"
  on public.contact_submissions for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- newsletter_subscribers: public can insert only; admin can read
-- ---------------------------------------------------------------------
create policy "newsletter_subscribers_public_insert"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

create policy "newsletter_subscribers_admin_read"
  on public.newsletter_subscribers for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- site_settings: public read, admin write
-- ---------------------------------------------------------------------
create policy "site_settings_public_read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings_admin_write"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);

create policy "site_settings_admin_insert"
  on public.site_settings for insert
  to authenticated
  with check (true);

-- ---------------------------------------------------------------------
-- Storage: "media" bucket — public read, authenticated write/delete
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
