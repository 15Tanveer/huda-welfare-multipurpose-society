-- V2 refinement: broaden HUDA's six narrow categories into six broader
-- community-development pillars (see src/lib/focus-areas.ts), and stop
-- exposing governing-body member rows to public (anon) API requests now
-- that the About page no longer renders them.
--
-- Any existing `programs`/`gallery` rows are remapped, never dropped —
-- see the UPDATE statements below for the old -> new value mapping.
--
-- Constraints are widened BEFORE the data is touched, and only
-- tightened to their final form afterwards: remapping a row to a new
-- category value while the old (still-active) CHECK constraint doesn't
-- yet allow that value fails with a check-constraint violation. An
-- empty `programs`/`gallery` table never exercises this, which is why
-- an earlier version of this migration only surfaced the bug when run
-- against a database with real pre-existing category values.

-- ---------------------------------------------------------------------
-- 1. Drop the old constraints so the remap below can't conflict with a
--    category list that no longer matches what's being written.
-- ---------------------------------------------------------------------
alter table public.programs drop constraint programs_category_check;
alter table public.gallery drop constraint gallery_category_check;

-- ---------------------------------------------------------------------
-- 2. Remap existing category values now that the old constraint no
--    longer applies.
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
-- 3. Re-add the CHECK constraints and column defaults in their final,
--    tightened form now that every row already satisfies them.
-- ---------------------------------------------------------------------
alter table public.programs add constraint programs_category_check
  check (category in (
    'education-career', 'healthcare-wellness', 'youth-skills-employment',
    'women-child-empowerment', 'community-rural-development',
    'environment-social-awareness', 'other'
  ));
alter table public.programs alter column category
  set default 'community-rural-development';

alter table public.gallery add constraint gallery_category_check
  check (category in (
    'education-career', 'healthcare-wellness', 'youth-skills-employment',
    'women-child-empowerment', 'community-rural-development',
    'environment-social-awareness', 'other'
  ));

-- ---------------------------------------------------------------------
-- 4. Governing-body privacy: the public website no longer renders team
--    members (see About page), so stop granting the anon role read
--    access to that table entirely. Admins (authenticated) keep full
--    access via the existing `team_members_admin_all` policy.
-- ---------------------------------------------------------------------
drop policy "team_members_public_read_active" on public.team_members;
