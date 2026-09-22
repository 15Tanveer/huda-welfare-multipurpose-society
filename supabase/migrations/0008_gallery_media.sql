-- Media Gallery upgrade: the `gallery` table becomes a mixed-media
-- collection (photos, videos/reels, press & media coverage) instead of a
-- photo-only one.
--
-- This migration is deliberately ADDITIVE ONLY. It adds columns, widens
-- one NOT NULL, and adds CHECK constraints that every existing row
-- already satisfies. It performs no UPDATE, no DELETE and no rename, so
-- existing gallery rows, their image paths and their program links are
-- untouched: each one simply becomes `media_type = 'photo'` via the
-- column default, with no manual backfill needed.
--
-- `media_type` and `category` are two different axes and stay that way:
-- `category` keeps holding HUDA's six programme/service areas + 'other'
-- (see 0004_recategorize.sql), while `media_type` describes the kind of
-- content. A newspaper clipping about a health camp is therefore
-- media_type='press' AND category='healthcare-wellness'.

-- ---------------------------------------------------------------------
-- 1. New columns
--
-- `image_path` keeps doing triple duty as "the image shown on the card":
-- the photograph for a photo, the scanned clipping/screenshot for press
-- coverage, and the optional cover/thumbnail for a video. That avoids a
-- near-duplicate `thumbnail_path` column and means every existing row
-- and every existing rendering path keeps working as-is.
-- ---------------------------------------------------------------------
alter table public.gallery
  add column if not exists media_type text not null default 'photo',
  add column if not exists video_url text null,
  add column if not exists video_source text null,
  add column if not exists source_name text null,
  add column if not exists coverage_url text null;

comment on column public.gallery.media_type is
  'photo | video | press — the kind of media. Independent of `category`.';
comment on column public.gallery.video_url is
  'Canonical watch URL for a video item. Embeds are generated in the application from this URL; iframe HTML is never stored.';
comment on column public.gallery.video_source is
  'youtube | instagram | facebook | external — how video_url should be embedded.';
comment on column public.gallery.source_name is
  'Publication / channel behind a press item (e.g. "Lokmat").';
comment on column public.gallery.coverage_url is
  'Optional link to the original online coverage for a press item.';
comment on column public.gallery.image_path is
  'Card image: the photograph (photo), the clipping or screenshot (press), or the optional cover image (video). Nullable since a video may only have a URL.';

-- ---------------------------------------------------------------------
-- 2. A video item can legitimately have no uploaded image at all (a
--    YouTube thumbnail is derived from the URL at render time), so
--    `image_path` can no longer be NOT NULL. Dropping a NOT NULL only
--    widens what is accepted — no existing row is affected.
-- ---------------------------------------------------------------------
alter table public.gallery alter column image_path drop not null;

-- ---------------------------------------------------------------------
-- 3. Value + per-media-type completeness constraints.
--
--    Existing rows are all photos with a non-null image_path, so they
--    already satisfy both constraints before these are added.
-- ---------------------------------------------------------------------
alter table public.gallery drop constraint if exists gallery_media_type_check;
alter table public.gallery add constraint gallery_media_type_check
  check (media_type in ('photo', 'video', 'press'));

alter table public.gallery drop constraint if exists gallery_video_source_check;
alter table public.gallery add constraint gallery_video_source_check
  check (
    video_source is null
    or video_source in ('youtube', 'instagram', 'facebook', 'external')
  );

alter table public.gallery drop constraint if exists gallery_media_requirements_check;
alter table public.gallery add constraint gallery_media_requirements_check
  check (
    case media_type
      when 'photo' then image_path is not null
      when 'press' then image_path is not null
      when 'video' then video_url is not null
      else false
    end
  );

-- ---------------------------------------------------------------------
-- 4. The public gallery filters by media type alongside the existing
--    category filter.
-- ---------------------------------------------------------------------
create index if not exists gallery_media_type_idx on public.gallery (media_type);
