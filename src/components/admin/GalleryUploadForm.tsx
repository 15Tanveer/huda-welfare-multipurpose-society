"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { createGalleryItem } from "@/actions/gallery";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { galleryPath } from "@/lib/supabase/storage";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";
import type { ProgramRow } from "@/types/database";

const initialState: ActionResult = { success: false, message: "" };

export function GalleryUploadForm({ programs }: { programs: ProgramRow[] }) {
  const [state, formAction, isPending] = useActionState(createGalleryItem, initialState);
  const [imagePath, setImagePath] = useState<string | null>(null);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">

      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
        Upload Photo
      </h2>

      <ImageUploader label="Photo" value={imagePath} onChange={setImagePath} pathFor={galleryPath} />
      <input type="hidden" name="image_path" value={imagePath ?? ""} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Title (optional)" htmlFor="title">
          <input id="title" name="title" className={inputClasses} />
        </FormField>
        <FormField label="Category" htmlFor="category" required>
          <select id="category" name="category" defaultValue="other" required className={inputClasses}>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Caption (optional)" htmlFor="caption">
        <input id="caption" name="caption" className={inputClasses} />
      </FormField>

      {programs.length > 0 ? (
        <FormField label="Link to a program (optional)" htmlFor="program_id">
          <select id="program_id" name="program_id" defaultValue="" className={inputClasses}>
            <option value="">None</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </FormField>
      ) : null}

      {!state.success && state.message ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={!imagePath || isPending} className="self-start">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Uploading…" : "Add to Gallery"}
      </Button>
    </form>
  );
}
