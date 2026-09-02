"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MEDIA_BUCKET,
  getPublicImageUrl,
} from "@/lib/supabase/storage";

interface ImageUploaderProps {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
  pathFor: (fileName: string) => string;
}

export function ImageUploader({ label, value, onChange, pathFor }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      setError("Please upload a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const path = pathFor(file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-"));
      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      onChange(path);
    } finally {
      setUploading(false);
    }
  }

  const previewUrl = getPublicImageUrl(value);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-brand-ink">{label}</span>

      {previewUrl ? (
        <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-lg border border-brand-ink/10">
          <Image src={previewUrl} alt="" fill sizes="320px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brand-ink shadow hover:bg-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-40 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-brand-ink/25 bg-brand-light/20 text-brand-muted transition-colors hover:bg-brand-light/40 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-brand" aria-hidden="true" />
          ) : (
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
          )}
          <span className="text-xs font-medium">
            {uploading ? "Uploading…" : "Click to upload an image"}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
