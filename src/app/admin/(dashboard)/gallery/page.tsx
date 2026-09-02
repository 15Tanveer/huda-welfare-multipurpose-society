import type { Metadata } from "next";
import Image from "next/image";
import { getGalleryItems } from "@/lib/data/gallery";
import { getAdminProgramList } from "@/lib/data/programs";
import { deleteGalleryItem } from "@/actions/gallery";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Gallery", robots: { index: false } };

export default async function AdminGalleryPage() {
  const [items, programs] = await Promise.all([getGalleryItems(), getAdminProgramList()]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Gallery</h1>
        <p className="text-sm text-brand-muted">Manage photos shown on the public gallery page.</p>
      </div>

      <GalleryUploadForm programs={programs} />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const url = getPublicImageUrl(item.image_path);
            const categoryLabel =
              GALLERY_CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category;
            return (
              <div key={item.id} className="flex flex-col overflow-hidden rounded-xl border border-brand-ink/8 bg-white">
                <div className="relative aspect-square w-full">
                  {url ? (
                    <Image src={url} alt={item.caption ?? ""} fill sizes="200px" className="object-cover" />
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="truncate text-xs font-medium text-brand-muted">{categoryLabel}</span>
                  <DeleteButton
                    action={deleteGalleryItem.bind(null, item.id)}
                    confirmMessage="Delete this photo from the gallery?"
                    label=""
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-brand-ink/15 bg-white px-6 py-12 text-center text-sm text-brand-muted">
          No photos in the gallery yet.
        </p>
      )}
    </div>
  );
}
