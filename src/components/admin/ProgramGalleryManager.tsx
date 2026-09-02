"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { ProgramGalleryRow } from "@/types/database";
import { addProgramGalleryImage, deleteProgramGalleryImage } from "@/actions/programs";
import { programGalleryPath, getPublicImageUrl } from "@/lib/supabase/storage";
import { ImageUploader } from "@/components/ui/ImageUploader";

export function ProgramGalleryManager({
  programId,
  items,
}: {
  programId: string;
  items: ProgramGalleryRow[];
}) {
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleAdd() {
    if (!pendingPath) return;
    startTransition(async () => {
      await addProgramGalleryImage(programId, pendingPath, caption || null);
      setPendingPath(null);
      setCaption("");
    });
  }

  function handleDelete(imageId: string) {
    setDeletingId(imageId);
    startTransition(async () => {
      await deleteProgramGalleryImage(programId, imageId);
      setDeletingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => {
            const url = getPublicImageUrl(item.image_path);
            return (
              <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-brand-ink/10">
                {url ? (
                  <Image src={url} alt={item.caption ?? ""} fill sizes="200px" className="object-cover" />
                ) : null}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending && deletingId === item.id}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  {isPending && deletingId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-brand-muted">No photos added to this program yet.</p>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-brand-ink/20 p-4 sm:flex-row sm:items-end">
        <ImageUploader
          label="Add a photo"
          value={pendingPath}
          onChange={setPendingPath}
          pathFor={(fileName) => programGalleryPath(programId, fileName)}
        />
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="gallery-caption" className="text-sm font-medium text-brand-ink">
            Caption (optional)
          </label>
          <input
            id="gallery-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded-lg border border-brand-ink/15 px-3.5 py-2.5 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!pendingPath || isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0f3d22] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add to Gallery
        </button>
      </div>
    </div>
  );
}
