export const MEDIA_BUCKET = "media";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/**
 * Storage paths are saved in the database (e.g. `gallery/xyz.jpg`), not
 * full URLs, so the bucket can be renamed or made private later without a
 * data migration. This resolves a stored path to a public URL for
 * rendering with `next/image`.
 */
export function getPublicImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  return `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

export function programCoverPath(programId: string, fileName: string) {
  return `programs/${programId}/cover-${Date.now()}-${fileName}`;
}

export function programGalleryPath(programId: string, fileName: string) {
  return `programs/${programId}/gallery-${Date.now()}-${fileName}`;
}

export function galleryPath(fileName: string) {
  return `gallery/${Date.now()}-${fileName}`;
}

export function teamPhotoPath(fileName: string) {
  return `team/${Date.now()}-${fileName}`;
}
