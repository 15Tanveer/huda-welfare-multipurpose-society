import type { Metadata } from "next";
import { getGalleryItemById, getGalleryItems } from "@/lib/data/gallery";
import { galleryItemLabel, galleryThumbnailUrl } from "@/lib/gallery-media";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

const BASE_DESCRIPTION =
  "Photographs, videos and press coverage from HUDA Welfare & Educational Multipurpose Society's community programs and activities.";

interface GalleryPageProps {
  /** `?item=<gallery row id>` — a shared link to one photo, video or clipping. */
  searchParams: Promise<{ item?: string }>;
}

/**
 * A shared gallery link should preview as the item itself — the clipping
 * or the video's thumbnail — rather than the site's generic card, since
 * that preview is most of what decides whether anyone opens it on
 * WhatsApp. The canonical URL stays `/gallery` so every item link is
 * consolidated into the one indexable page.
 */
export async function generateMetadata({ searchParams }: GalleryPageProps): Promise<Metadata> {
  const { item: itemId } = await searchParams;
  const item = itemId ? await getGalleryItemById(itemId) : null;

  if (!item) {
    return {
      title: "Gallery",
      description: BASE_DESCRIPTION,
      alternates: { canonical: "/gallery" },
    };
  }

  const title = galleryItemLabel(item);
  const description =
    item.caption ??
    (item.media_type === "press" && item.source_name
      ? `${title} — coverage in ${item.source_name}.`
      : BASE_DESCRIPTION);
  const image = galleryThumbnailUrl(item);

  return {
    title,
    description,
    alternates: { canonical: "/gallery" },
    openGraph: {
      title,
      description,
      url: `/gallery?item=${item.id}`,
      images: image ? [image] : undefined,
    },
  };
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const [items, { item: itemId }] = await Promise.all([getGalleryItems(), searchParams]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our activity gallery"
        description="Photographs, videos and media coverage from HUDA's community programs will appear here as they are conducted."
      />

      <Container className="py-16 sm:py-20">
        <GalleryGrid items={items} initialItemId={itemId} />
      </Container>
    </>
  );
}
