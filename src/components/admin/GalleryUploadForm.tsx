"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent } from "react";
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

const FIELD_ORDER = ["title", "category", "caption", "program_id"];

export function GalleryUploadForm({ programs }: { programs: ProgramRow[] }) {
  const [state, formAction, isPending] = useActionState(createGalleryItem, initialState);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [caption, setCaption] = useState("");
  const [programId, setProgramId] = useState("");
  const errors = state.fieldErrors ?? {};

  const lastState = useRef<ActionResult | undefined>(undefined);
  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (!state.fieldErrors) return;
    const firstInvalidField = FIELD_ORDER.find((name) => state.fieldErrors?.[name]);
    if (!firstInvalidField) return;
    const el = document.getElementById(firstInvalidField);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus();
  }, [state]);

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleCaption = (e: ChangeEvent<HTMLInputElement>) => setCaption(e.target.value);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">

      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
        Upload Photo
      </h2>

      <ImageUploader label="Photo" value={imagePath} onChange={setImagePath} pathFor={galleryPath} />
      <input type="hidden" name="image_path" value={imagePath ?? ""} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Title (optional)" htmlFor="title" error={errors.title?.[0]}>
          <input id="title" name="title" value={title} className={inputClasses} onChange={handleTitle} />
        </FormField>
        <FormField label="Category" htmlFor="category" required error={errors.category?.[0]}>
          <select
            id="category"
            name="category"
            value={category}
            required
            className={inputClasses}
            onChange={(e) => setCategory(e.target.value)}
          >
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Caption (optional)" htmlFor="caption" error={errors.caption?.[0]}>
        <input id="caption" name="caption" value={caption} className={inputClasses} onChange={handleCaption} />
      </FormField>

      {programs.length > 0 ? (
        <FormField label="Link to a program (optional)" htmlFor="program_id" error={errors.program_id?.[0]}>
          <select
            id="program_id"
            name="program_id"
            value={programId}
            className={inputClasses}
            onChange={(e) => setProgramId(e.target.value)}
          >
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
