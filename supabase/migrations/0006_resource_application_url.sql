-- Phase 2 (curated content) surfaced two real gaps in the Phase 1 schema:
--
-- 1. Maharashtra migrated several scheme categories to MahaDBT 2.0, so an
--    old application URL found on a scheme's info page may no longer be
--    the correct place to actually apply. `official_url` (the resource's
--    existing single link field) is kept as the "official source /
--    information" link; `application_url` is a new, separate, optional
--    field for a *verified* current application destination. When it's
--    null, the public page shows only "View Official Information"
--    instead of a possibly-wrong "Apply Now" button — see the CTA logic
--    in src/app/(public)/resources/[slug]/page.tsx.
--
-- 2. Audience scanability: resources already have a free-text `audience`
--    paragraph ("Who Is This For"), but a Hinganghat student skimming on
--    WhatsApp needs to tell relevance apart even faster. `audience_tags`
--    is a plain text array of short labels (Students, Farmers, Women,
--    ...) — not a new lookup table or enum, just tags on the row.

alter table public.resources add column application_url text null;
alter table public.resources add column audience_tags text[] not null default '{}';
