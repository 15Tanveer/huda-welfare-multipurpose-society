-- V2 refinement: broaden HUDA's six narrow categories into six broader
-- community-development pillars (see src/lib/focus-areas.ts), and stop
-- exposing governing-body member rows to public (anon) API requests now
-- that the About page no longer renders them.
--
-- Any existing `programs`/`gallery` rows are remapped, never dropped —
-- see the UPDATE statements below for the old -> new value mapping.

-- ---------------------------------------------------------------------
-- 1. Remap existing category values before changing the constraints,
--    so no row is ever left violating the new CHECK.
-- ---------------------------------------------------------------------
update public.programs set category = case category
  when 'education' then 'education-career'
  when 'healthcare' then 'healthcare-wellness'
  when 'skill-development' then 'youth-skills-employment'
  when 'women-empowerment' then 'women-child-empowerment'
  when 'community-welfare' then 'community-rural-development'
  when 'social-awareness' then 'environment-social-awareness'
  else category
end
where category in (
  'education', 'healthcare', 'skill-development',
  'women-empowerment', 'community-welfare', 'social-awareness'
);

update public.gallery set category = case category
  when 'education' then 'education-career'
  when 'healthcare' then 'healthcare-wellness'
  when 'skill-development' then 'youth-skills-employment'
  when 'community' then 'community-rural-development'
  when 'awareness' then 'environment-social-awareness'
  else category
end
where category in ('education', 'healthcare', 'skill-development', 'community', 'awareness');

-- ---------------------------------------------------------------------
-- 2. Replace the CHECK constraints and column defaults with the new
--    six-pillar values.
-- ---------------------------------------------------------------------
alter table public.programs drop constraint programs_category_check;
alter table public.programs add constraint programs_category_check
  check (category in (
    'education-career', 'healthcare-wellness', 'youth-skills-employment',
    'women-child-empowerment', 'community-rural-development',
    'environment-social-awareness', 'other'
  ));
alter table public.programs alter column category
  set default 'community-rural-development';

alter table public.gallery drop constraint gallery_category_check;
alter table public.gallery add constraint gallery_category_check
  check (category in (
    'education-career', 'healthcare-wellness', 'youth-skills-employment',
    'women-child-empowerment', 'community-rural-development',
    'environment-social-awareness', 'other'
  ));

-- ---------------------------------------------------------------------
-- 3. Governing-body privacy: the public website no longer renders team
--    members (see About page), so stop granting the anon role read
--    access to that table entirely. Admins (authenticated) keep full
--    access via the existing `team_members_admin_all` policy.
-- ---------------------------------------------------------------------
drop policy "team_members_public_read_active" on public.team_members;
