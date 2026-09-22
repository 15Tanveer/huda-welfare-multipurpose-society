import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Newspaper, Play } from "lucide-react";
import { getGalleryItems } from "@/lib/data/gallery";
import { getAdminProgramList } from "@/lib/data/programs";
import { createGalleryItem, deleteGalleryItem } from "@/actions/gallery";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { galleryThumbnailUrl, mediaTypeBadgeLabel } from "@/lib/gallery-media";
import { GalleryMediaForm } from "@/components/admin/GalleryMediaForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";

export const metadata: Metadata = { title: "Gallery", robots: { index: false } };

export default async function AdminGalleryPage() {
  const [items, programs] = await Promise.all([getGalleryItems(), getAdminProgramList()]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Gallery</h1>
        <p className="text-sm text-brand-muted">
          Manage the photos, videos and press coverage shown on the public gallery page.
        </p>
      </div>

      <GalleryMediaForm
        programs={programs}
        action={createGalleryItem}
        submitLabel="Add to Gallery"
        heading="Add Media"
        resetOnSuccess
      />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const url = galleryThumbnailUrl(item);
            const categoryLabel =
              GALLERY_CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category;
            return (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-brand-ink/8 bg-white"
              >
                <div className="relative aspect-square w-full">
                  {url ? (
                    <Image
                      src={url}
                      alt={item.title ?? item.caption ?? ""}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <BrandPlaceholder className="h-full w-full" />
                  )}
                  {item.media_type !== "photo" ? (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand-ink/80 px-2 py-1 text-[11px] font-medium text-white">
                      {item.media_type === "video" ? (
                        <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                      ) : (
                        <Newspaper className="h-3 w-3" aria-hidden="true" />
                      )}
                      {mediaTypeBadgeLabel(item.media_type)}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <p className="truncate text-xs font-medium text-brand-ink">
                    {item.title ?? item.caption ?? "Untitled"}
                  </p>
                  <span className="truncate text-xs text-brand-muted">{categoryLabel}</span>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/gallery/${item.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-brand-deep hover:bg-brand-light"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteGalleryItem.bind(null, item.id)}
                      confirmMessage="Delete this item from the gallery?"
                      label=""
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-brand-ink/15 bg-white px-6 py-12 text-center text-sm text-brand-muted">
          Nothing in the gallery yet.
        </p>
      )}
    </div>
  );
}
