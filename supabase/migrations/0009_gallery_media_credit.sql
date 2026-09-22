-- Credit the outlet behind a gallery item properly.
--
-- `source_name` already existed but was only reachable for press items,
-- and there was nowhere to record the outlet's own logo or channel. A
-- news channel that covers a HUDA programme should be visibly credited
-- — its name, its mark and a way through to its channel — on the video
-- as well as on a clipping.
--
-- Additive only: two nullable columns, no default, no data touched. Rows
-- without them simply render the name alone, exactly as today.

alter table public.gallery
  add column if not exists source_logo_path text null,
  add column if not exists source_url text null;

comment on column public.gallery.source_name is
  'The outlet behind the item — a publication for a clipping, a channel for a news video.';
comment on column public.gallery.source_logo_path is
  'Storage path of the outlet''s logo, shown beside its name in the item detail panel.';
comment on column public.gallery.source_url is
  'The outlet''s own page or channel, distinct from coverage_url (the individual article).';
