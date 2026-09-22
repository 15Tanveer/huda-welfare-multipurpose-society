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

const NETWORK_FAILURE = /failed to fetch|network|load failed|timeout|aborted/i;
const ALREADY_EXISTS = /already exists|duplicate|resource already/i;
const SESSION_EXPIRED = /row-level security|jwt|unauthorized|not authenticated|403/i;
const TOO_LARGE = /exceeded|too large|payload|413/i;

/**
 * Supabase's own wording is either opaque ("Failed to fetch") or
 * internal ("new row violates row-level security policy"). An admin
 * uploading a photo on a phone needs to know what to *do*, so each
 * class of failure is translated into its next step, with the original
 * reason kept for anything unrecognised.
 */
function describeUploadError(message: string): string {
  if (!message) return "The upload didn't go through. Please try again.";
  if (NETWORK_FAILURE.test(message)) {
    return "Couldn't reach the server — check your connection and try again. If this page has been open a while, reload it and sign in again.";
  }
  if (SESSION_EXPIRED.test(message)) {
    return "Your admin session has expired. Reload this page, sign in again, and re-upload.";
  }
  if (TOO_LARGE.test(message)) return "That file is too large to upload. Try one under 5MB.";
  return message;
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

      // Two attempts, because the common failure here isn't the server
      // refusing the file — it's the request never arriving: a phone
      // dropping its connection mid-upload, or the auth token's refresh
      // call failing on a page that has been open a while. Both surface
      // as a bare "Failed to fetch", and both usually succeed on a
      // second try. Anything the server actually answered is final, so
      // it isn't retried.
      let lastMessage = "";
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const { error: uploadError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, file, { upsert: false });

        if (!uploadError) {
          onChange(path);
          return;
        }

        // The first attempt can land after its response is lost, so a
        // retry that reports this exact path already exists means the
        // file is in fact stored.
        if (attempt > 0 && ALREADY_EXISTS.test(uploadError.message)) {
          onChange(path);
          return;
        }

        lastMessage = uploadError.message;
        if (!NETWORK_FAILURE.test(uploadError.message)) break;
      }

      setError(describeUploadError(lastMessage));
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
