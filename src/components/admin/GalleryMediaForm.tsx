"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { GALLERY_MEDIA_TYPES, GALLERY_VIDEO_SOURCES } from "@/lib/gallery-media";
import { galleryPath } from "@/lib/supabase/storage";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";
import type { GalleryMediaType, GalleryRow, ProgramRow } from "@/types/database";

const initialState: ActionResult = { success: false, message: "" };

type GalleryAction = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

// Matches the form's visual top-to-bottom order, so scrolling to the
// first key present in fieldErrors lands on the field that really comes
// first on screen.
const FIELD_ORDER = [
  "media_type",
  "video_source",
  "video_url",
  "image_path",
  "title",
  "source_name",
  "source_url",
  "coverage_url",
  "category",
  "caption",
  "program_id",
];

interface TextFieldValues {
  title: string;
  caption: string;
  video_url: string;
  source_name: string;
  source_url: string;
  coverage_url: string;
}

function initialTextValues(item?: GalleryRow): TextFieldValues {
  return {
    title: item?.title ?? "",
    caption: item?.caption ?? "",
    video_url: item?.video_url ?? "",
    source_name: item?.source_name ?? "",
    source_url: item?.source_url ?? "",
    coverage_url: item?.coverage_url ?? "",
  };
}

/**
 * The single admin form for every gallery media type. The media-type
 * select at the top swaps which fields are shown; the fields that don't
 * apply are cleared server-side on save (see `normalizeGalleryInput`),
 * so switching an existing item's type never leaves stale data behind.
 */
export function GalleryMediaForm({
  item,
  programs,
  action,
  submitLabel,
  /** Create mode empties the form again after a successful save. */
  resetOnSuccess = false,
  heading,
}: {
  item?: GalleryRow;
  programs: ProgramRow[];
  action: GalleryAction;
  submitLabel: string;
  resetOnSuccess?: boolean;
  heading?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [mediaType, setMediaType] = useState<GalleryMediaType>(item?.media_type ?? "photo");
  const [imagePath, setImagePath] = useState<string | null>(item?.image_path ?? null);
  const [category, setCategory] = useState(item?.category ?? "other");
  const [programId, setProgramId] = useState(item?.program_id ?? "");
  const [videoSource, setVideoSource] = useState(item?.video_source ?? "youtube");
  const [sourceLogoPath, setSourceLogoPath] = useState<string | null>(
    item?.source_logo_path ?? null
  );
  const [values, setValues] = useState<TextFieldValues>(() => initialTextValues(item));

  const errors = state.fieldErrors ?? {};

  // Emptying the form after a successful create is state derived from
  // the action result, so it's adjusted during render rather than in an
  // effect (see https://react.dev/learn/you-might-not-need-an-effect).
  const [handledState, setHandledState] = useState<ActionResult>(initialState);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success && resetOnSuccess) {
      setMediaType("photo");
      setImagePath(null);
      setCategory("other");
      setProgramId("");
      setVideoSource("youtube");
      setSourceLogoPath(null);
      setValues(initialTextValues());
    }
  }

  // Moving focus is a DOM side effect, so this half stays in an effect.
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

  const setField =
    (key: keyof TextFieldValues) => (e: ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const isPhoto = mediaType === "photo";
  const isVideo = mediaType === "video";
  const isPress = mediaType === "press";

  const imageLabel = isPress
    ? "Coverage Image"
    : isVideo
      ? "Thumbnail / Cover Image (optional)"
      : "Photo";

  const sourceHint = GALLERY_VIDEO_SOURCES.find((s) => s.value === videoSource)?.hint;

  // A photo is only savable once its file is uploaded; a video needs at
  // least a URL. Press coverage needs its image, same as a photo.
  const canSubmit = isVideo ? values.video_url.trim().length > 0 : Boolean(imagePath);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6"
    >
      {heading ? (
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">{heading}</h2>
      ) : null}

      <FormField label="Media Type" htmlFor="media_type" required error={errors.media_type?.[0]}>
        <select
          id="media_type"
          name="media_type"
          value={mediaType}
          required
          className={inputClasses}
          onChange={(e) => setMediaType(e.target.value as GalleryMediaType)}
        >
          {GALLERY_MEDIA_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </FormField>

      {isVideo ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Video Source"
            htmlFor="video_source"
            required
            error={errors.video_source?.[0]}
            hint={sourceHint}
          >
            <select
              id="video_source"
              name="video_source"
              value={videoSource}
              required
              className={inputClasses}
              onChange={(e) =>
                setVideoSource(e.target.value as NonNullable<GalleryRow["video_source"]>)
              }
            >
              {GALLERY_VIDEO_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Video URL"
            htmlFor="video_url"
            required
            error={errors.video_url?.[0]}
            hint="Paste the normal watch/share link — the player is built from it automatically."
          >
            <input
              id="video_url"
              name="video_url"
              type="url"
              inputMode="url"
              value={values.video_url}
              required
              placeholder="https://youtu.be/…"
              className={inputClasses}
              onChange={setField("video_url")}
            />
          </FormField>
        </div>
      ) : (
        <input type="hidden" name="video_url" value="" />
      )}

      <div>
        <ImageUploader
          label={imageLabel}
          value={imagePath}
          onChange={setImagePath}
          pathFor={galleryPath}
        />
        <input type="hidden" name="image_path" value={imagePath ?? ""} />
        {/* The uploader itself has no focusable id, so errors for the
            underlying field are surfaced here instead. */}
        {errors.image_path?.[0] ? (
          <p id="image_path" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.image_path[0]}
          </p>
        ) : null}
        {isVideo ? (
          <p className="mt-1.5 text-xs text-brand-muted">
            Optional. YouTube videos fall back to YouTube&rsquo;s own thumbnail when left empty.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label={isPhoto ? "Title (optional)" : "Title"}
          htmlFor="title"
          required={!isPhoto}
          error={errors.title?.[0]}
        >
          <input
            id="title"
            name="title"
            value={values.title}
            required={!isPhoto}
            className={inputClasses}
            onChange={setField("title")}
          />
        </FormField>

        <FormField label="Category" htmlFor="category" required error={errors.category?.[0]}>
          <select
            id="category"
            name="category"
            value={category}
            required
            className={inputClasses}
            onChange={(e) => setCategory(e.target.value as GalleryRow["category"])}
          >
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Crediting the outlet applies to a news video as much as to a
          clipping — a channel that covers a HUDA programme is named,
          shown and linked on both. */}
      {isPress || isVideo ? (
        <fieldset className="flex flex-col gap-5 rounded-xl border border-brand-ink/10 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-brand-deep">
            {isPress ? "Publication credit" : "Channel credit"}
          </legend>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label={isPress ? "Publication / Source (optional)" : "Channel / Source (optional)"}
              htmlFor="source_name"
              error={errors.source_name?.[0]}
              hint={
                isPress
                  ? "e.g. Anti Crime News, Lokmat"
                  : "e.g. News Tempo — shown as \u201cCoverage by\u201d on the item"
              }
            >
              <input
                id="source_name"
                name="source_name"
                value={values.source_name}
                className={inputClasses}
                onChange={setField("source_name")}
              />
            </FormField>

            <FormField
              label={isPress ? "Publication page (optional)" : "Channel link (optional)"}
              htmlFor="source_url"
              error={errors.source_url?.[0]}
              hint="Their own page or channel — not this particular story."
            >
              <input
                id="source_url"
                name="source_url"
                type="url"
                inputMode="url"
                value={values.source_url}
                className={inputClasses}
                onChange={setField("source_url")}
              />
            </FormField>
          </div>

          <div>
            <ImageUploader
              label="Publication / channel logo (optional)"
              value={sourceLogoPath}
              onChange={setSourceLogoPath}
              pathFor={galleryPath}
            />
            <input type="hidden" name="source_logo_path" value={sourceLogoPath ?? ""} />
            <p className="mt-1.5 text-xs text-brand-muted">
              Shown beside the name on the item. A square logo works best.
            </p>
          </div>

          {isPress ? (
            <FormField
              label="Coverage URL (optional)"
              htmlFor="coverage_url"
              error={errors.coverage_url?.[0]}
              hint="Link to this particular article, if it is online."
            >
              <input
                id="coverage_url"
                name="coverage_url"
                type="url"
                inputMode="url"
                value={values.coverage_url}
                className={inputClasses}
                onChange={setField("coverage_url")}
              />
            </FormField>
          ) : (
            <input type="hidden" name="coverage_url" value="" />
          )}
        </fieldset>
      ) : (
        <>
          <input type="hidden" name="source_name" value="" />
          <input type="hidden" name="source_url" value="" />
          <input type="hidden" name="source_logo_path" value="" />
          <input type="hidden" name="coverage_url" value="" />
        </>
      )}

      <FormField
        label={isPhoto ? "Caption (optional)" : "Caption / Description (optional)"}
        htmlFor="caption"
        error={errors.caption?.[0]}
      >
        <input
          id="caption"
          name="caption"
          value={values.caption}
          className={inputClasses}
          onChange={setField("caption")}
        />
      </FormField>

      {programs.length > 0 ? (
        <FormField
          label="Link to a program (optional)"
          htmlFor="program_id"
          error={errors.program_id?.[0]}
          hint="Linked media also appears on that program's page."
        >
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
      {state.success && state.message ? (
        <p role="status" className="text-sm font-medium text-brand-deep">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={!canSubmit || isPending} className="self-start">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
