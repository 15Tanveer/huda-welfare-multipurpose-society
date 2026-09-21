import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getGalleryItemById } from "@/lib/data/gallery";
import { getAdminProgramList } from "@/lib/data/programs";
import { updateGalleryItem } from "@/actions/gallery";
import { mediaTypeLabel } from "@/lib/gallery-media";
import { GalleryMediaForm } from "@/components/admin/GalleryMediaForm";

export const metadata: Metadata = { title: "Edit Gallery Item", robots: { index: false } };

interface EditGalleryItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryItemPage({ params }: EditGalleryItemPageProps) {
  const { id } = await params;
  const [item, programs] = await Promise.all([getGalleryItemById(id), getAdminProgramList()]);

  if (!item) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/gallery"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-deep transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Gallery
        </Link>
        <h1 className="text-2xl font-semibold text-brand-ink">Edit Gallery Item</h1>
        <p className="text-sm text-brand-muted">
          {item.title ?? item.caption ?? mediaTypeLabel(item.media_type)}
        </p>
      </div>

      <GalleryMediaForm
        item={item}
        programs={programs}
        action={updateGalleryItem.bind(null, item.id)}
        submitLabel="Save Changes"
      />
    </div>
  );
}
