import type {
  GalleryCategory,
  GalleryMediaType,
  GalleryRow,
  GalleryVideoSource,
  ProgramGalleryRow,
} from "@/types/database";
import { getPublicImageUrl } from "@/lib/supabase/storage";

/**
 * Media-type helpers for the gallery.
 *
 * Nothing here ever trusts, stores or renders admin-supplied HTML: an
 * admin saves a plain watch URL and every embed below is generated from
 * the parsed pieces of that URL (a video id, a shortcode), so a stored
 * value can never reach the DOM as markup.
 */

export const GALLERY_MEDIA_TYPES: {
  value: GalleryMediaType;
  /** Admin form wording. */
  label: string;
  /** Public filter wording. */
  filterLabel: string;
  /** Card badge wording. */
  badgeLabel: string;
}[] = [
  { value: "photo", label: "Photo", filterLabel: "Photos", badgeLabel: "Photo" },
  { value: "video", label: "Video / Reel", filterLabel: "Videos", badgeLabel: "Video / Reel" },
  {
    value: "press",
    label: "Press & Media Coverage",
    filterLabel: "Press & Media",
    badgeLabel: "Press Coverage",
  },
];

export const GALLERY_VIDEO_SOURCES: {
  value: GalleryVideoSource;
  label: string;
  hint: string;
}[] = [
  {
    value: "youtube",
    label: "YouTube",
    hint: "youtube.com/watch?v=…, youtu.be/… or youtube.com/shorts/…",
  },
  { value: "instagram", label: "Instagram", hint: "instagram.com/reel/… or instagram.com/p/…" },
  { value: "facebook", label: "Facebook", hint: "facebook.com/…/videos/… or fb.watch/…" },
  {
    value: "external",
    label: "External Video URL",
    hint: "Any https:// link. Direct .mp4 / .webm files play inline; anything else opens in a new tab.",
  },
];

export function mediaTypeLabel(value: GalleryMediaType) {
  return GALLERY_MEDIA_TYPES.find((t) => t.value === value)?.label ?? "Photo";
}

export function mediaTypeBadgeLabel(value: GalleryMediaType) {
  return GALLERY_MEDIA_TYPES.find((t) => t.value === value)?.badgeLabel ?? "Photo";
}

export function videoSourceLabel(value: GalleryVideoSource | null) {
  if (!value) return null;
  return GALLERY_VIDEO_SOURCES.find((s) => s.value === value)?.label ?? null;
}

/**
 * Parses a URL and accepts it only when it is http(s) — the single place
 * a `javascript:`, `data:` or otherwise unexpected scheme is rejected,
 * used by both the Zod schema and every render path below.
 */
export function safeHttpUrl(raw: string | null | undefined): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{8,15}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
]);

function hostWithoutWww(url: URL) {
  return url.hostname.replace(/^www\./, "").toLowerCase();
}

/**
 * Extracts the video id from the YouTube URL shapes an admin is likely
 * to paste: `watch?v=`, `youtu.be/`, `shorts/`, plus `embed/` and
 * `live/` for completeness.
 */
export function youTubeVideoId(raw: string | null | undefined): string | null {
  const url = safeHttpUrl(raw);
  if (!url) return null;
  const host = hostWithoutWww(url);

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && YOUTUBE_ID.test(id) ? id : null;
  }

  if (!YOUTUBE_HOSTS.has(host)) return null;

  if (url.pathname === "/watch") {
    const id = url.searchParams.get("v");
    return id && YOUTUBE_ID.test(id) ? id : null;
  }

  const match = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/);
  const id = match?.[1];
  return id && YOUTUBE_ID.test(id) ? id : null;
}

/** Privacy-friendly player URL. Only ever built from a validated id. */
export function youTubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
}

/**
 * YouTube's own thumbnail. `hqdefault` is 480x360 and exists for every
 * public video (unlike `maxresdefault`), so it never 404s into a broken
 * card.
 */
export function youTubeThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function instagramEmbedUrl(url: URL): string | null {
  if (!hostWithoutWww(url).endsWith("instagram.com")) return null;
  const match = url.pathname.match(/\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  const kind = match[1] === "reels" ? "reel" : match[1];
  // Instagram's script-free iframe endpoint — no third-party JS bundle.
  return `https://www.instagram.com/${kind}/${match[2]}/embed`;
}

function facebookEmbedUrl(url: URL): string | null {
  const host = hostWithoutWww(url);
  if (!host.endsWith("facebook.com") && host !== "fb.watch") return null;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    url.toString()
  )}&show_text=false`;
}

const VIDEO_FILE = /\.(mp4|webm|ogg|ogv|mov)$/i;

export type VideoEmbed =
  /** Rendered in an <iframe> inside the modal, only once opened. */
  | { kind: "iframe"; src: string; portrait: boolean }
  /** A direct video file, played with the native <video> element. */
  | { kind: "file"; src: string }
  /** Nothing embeds reliably — open the original safely in a new tab. */
  | { kind: "link"; href: string };

/**
 * Decides how a stored video URL should be presented. Never called at
 * grid render time: the grid shows a thumbnail, and this only runs when
 * the visitor actually opens the item.
 */
export function resolveVideoEmbed(item: {
  video_url: string | null;
  video_source: GalleryVideoSource | null;
}): VideoEmbed | null {
  const url = safeHttpUrl(item.video_url);
  if (!url) return null;

  const youTubeId = youTubeVideoId(item.video_url);
  if (youTubeId) {
    return { kind: "iframe", src: youTubeEmbedUrl(youTubeId), portrait: false };
  }

  const instagram = instagramEmbedUrl(url);
  if (instagram) return { kind: "iframe", src: instagram, portrait: true };

  const facebook = facebookEmbedUrl(url);
  if (facebook) return { kind: "iframe", src: facebook, portrait: false };

  if (VIDEO_FILE.test(url.pathname)) return { kind: "file", src: url.toString() };

  return { kind: "link", href: url.toString() };
}

/**
 * The image a gallery card should show: the uploaded file when there is
 * one, otherwise YouTube's own thumbnail for a YouTube video. `null`
 * means "render the brand placeholder instead".
 */
export function galleryThumbnailUrl(item: GalleryRow): string | null {
  const uploaded = getPublicImageUrl(item.image_path);
  if (uploaded) return uploaded;
  if (item.media_type !== "video") return null;
  const youTubeId = youTubeVideoId(item.video_url);
  return youTubeId ? youTubeThumbnailUrl(youTubeId) : null;
}

/** Best available human label for a card or lightbox caption. */
export function galleryItemLabel(item: GalleryRow): string {
  return item.title || item.caption || mediaTypeBadgeLabel(item.media_type);
}

/**
 * Synthesized ids for `program_gallery` rows presented as gallery items.
 * They are not rows of the `gallery` table, so nothing can deep-link to
 * them on /gallery — see `galleryShareUrl`.
 */
const PROGRAM_GALLERY_ID_PREFIX = "program-gallery-";

/**
 * HUDA's own link for a gallery item: the gallery page with the item
 * opened. Sharing always points here rather than at a YouTube or news
 * URL, so shared media brings people to the site; the original stays one
 * click away inside the item itself.
 *
 * `null` for a program's own photo, which has no gallery row to open.
 */
export function galleryShareUrl(item: GalleryRow, siteUrl: string): string | null {
  if (item.id.startsWith(PROGRAM_GALLERY_ID_PREFIX)) return null;
  return `${siteUrl.replace(/\/$/, "")}/gallery?item=${encodeURIComponent(item.id)}`;
}

/** "Watch on YouTube" / "Open original video" for a video item's source. */
export function watchOriginalLabel(item: GalleryRow): string {
  const source = videoSourceLabel(item.video_source);
  return source && source !== "External Video URL" ? `Watch on ${source}` : "Open original video";
}

/**
 * Presents a `program_gallery` row (the program's own photo set) in the
 * same shape as a general gallery item, so one lightbox and one set of
 * cards can render both without copying rows between the two tables.
 */
export function programGalleryAsMediaItem(
  row: ProgramGalleryRow,
  category: GalleryCategory
): GalleryRow {
  return {
    id: `${PROGRAM_GALLERY_ID_PREFIX}${row.id}`,
    title: null,
    caption: row.caption,
    category,
    image_path: row.image_path,
    media_type: "photo",
    video_url: null,
    video_source: null,
    source_name: null,
    coverage_url: null,
    program_id: row.program_id,
    display_order: row.display_order,
    created_at: row.created_at,
  };
}

export interface ProgramMedia {
  photos: GalleryRow[];
  videos: GalleryRow[];
  press: GalleryRow[];
}

/**
 * Splits everything attached to a program into the three sections its
 * page renders.
 *
 * Photos come from two places by design: `program_gallery` (uploaded on
 * the program's own edit screen) and any general gallery photo an admin
 * linked to the program. The same file uploaded to both is shown once —
 * de-duplicated on storage path — so nothing appears twice.
 */
export function buildProgramMedia(
  programGallery: ProgramGalleryRow[],
  linkedGalleryItems: GalleryRow[],
  category: GalleryCategory
): ProgramMedia {
  const photos = programGallery.map((row) => programGalleryAsMediaItem(row, category));
  const seenPaths = new Set(photos.map((p) => p.image_path));

  for (const item of linkedGalleryItems) {
    if (item.media_type !== "photo") continue;
    if (item.image_path && seenPaths.has(item.image_path)) continue;
    if (item.image_path) seenPaths.add(item.image_path);
    photos.push(item);
  }

  return {
    photos,
    videos: linkedGalleryItems.filter((i) => i.media_type === "video"),
    press: linkedGalleryItems.filter((i) => i.media_type === "press"),
  };
}
