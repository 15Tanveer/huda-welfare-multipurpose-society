import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/data/gallery";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs, videos and press coverage from HUDA Welfare & Educational Multipurpose Society's community programs and activities.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our activity gallery"
        description="Photographs, videos and media coverage from HUDA's community programs will appear here as they are conducted."
      />

      {/* GalleryGrid renders its own sticky filter bar directly under the
          hero, then the grid inside a Container. */}
      <GalleryGrid items={items} />
    </>
  );
}
