-- Neutral seed data only. No fake staff, volunteers, beneficiaries,
-- testimonials or past events — see AGENTS / README "content rules".

insert into public.site_settings (
  id, organization_name, short_name, tagline, city, state, mission, vision
) values (
  1,
  'HUDA Welfare & Educational Multipurpose Society',
  'HUDA',
  'Working across education, healthcare, skills, empowerment and community development to help create meaningful opportunities for people and communities.',
  'Hinganghat',
  'Maharashtra',
  'To strengthen communities by improving access to education, healthcare awareness, skills, opportunities and social support through practical, inclusive and responsible initiatives.',
  'To build informed, healthy, skilled and empowered communities where people have greater awareness, opportunities and support to improve their lives.'
)
on conflict (id) do nothing;

-- The organization's first planned community program. Details are
-- intentionally generic until an admin fills them in after being
-- finalised — see spec section 15/49 (the 20 September 2026 workflow).
insert into public.programs (
  title, slug, short_description, description, date, city, category, status, featured
) values (
  'Upcoming Community Program',
  'upcoming-community-program-sep-2026',
  'Details will be announced soon.',
  'HUDA Welfare & Educational Multipurpose Society is planning its first community program. Full details — including the venue and schedule — will be announced here as they are finalised.',
  '2026-09-20',
  'Hinganghat',
  'community-rural-development',
  'upcoming',
  true
)
on conflict (slug) do nothing;
