-- Neutral seed data only. No fake staff, volunteers, beneficiaries,
-- testimonials or past events — see AGENTS / README "content rules".

insert into public.site_settings (
  id, organization_name, short_name, tagline, city, state, mission, vision
) values (
  1,
  'HUDA Welfare & Educational Multipurpose Society',
  'HUDA',
  'Working together for education, healthcare, empowerment and community welfare.',
  'Hinganghat',
  'Maharashtra',
  'To support community development through education, healthcare awareness, empowerment, skills and socially responsible initiatives.',
  'To help build an educated, healthy, skilled and empowered community where people have greater access to opportunities and support.'
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
  'community-welfare',
  'upcoming',
  true
)
on conflict (slug) do nothing;
