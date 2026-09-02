import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/data/gallery";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from HUDA Welfare & Educational Multipurpose Society's community programs and activities.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our activity gallery"
        description="Photographs from HUDA's community programs will appear here as they are conducted."
      />

      <Container className="py-16 sm:py-20">
        <GalleryGrid items={items} />
      </Container>
    </>
  );
}
