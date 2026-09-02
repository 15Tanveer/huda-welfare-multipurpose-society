"use client";

import { useActionState, useId, useState } from "react";
import { Loader2 } from "lucide-react";
import type { ProgramRow } from "@/types/database";
import { PROGRAM_CATEGORIES } from "@/lib/constants";
import { programCoverPath } from "@/lib/supabase/storage";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

type ProgramAction = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProgramForm({
  program,
  action,
  submitLabel,
}: {
  program?: ProgramRow;
  action: ProgramAction;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [slugEdited, setSlugEdited] = useState(Boolean(program));
  const [slug, setSlug] = useState(program?.slug ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(program?.cover_image ?? null);
  const [status, setStatus] = useState(program?.status ?? "upcoming");

  const errors = state.fieldErrors ?? {};
  const draftId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tempIdForUpload = program?.id ?? `draft-${draftId}`;

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title" required error={errors.title?.[0]}>
          <input
            id="title"
            name="title"
            defaultValue={program?.title}
            required
            className={inputClasses}
            onChange={(e) => {
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" required error={errors.slug?.[0]} hint="Used in the program URL">
          <input
            id="slug"
            name="slug"
            value={slug}
            required
            className={inputClasses}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(slugify(e.target.value));
            }}
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField
            label="Short Description"
            htmlFor="short_description"
            required
            error={errors.short_description?.[0]}
            hint="Shown on program cards and listing pages"
          >
            <input
              id="short_description"
              name="short_description"
              defaultValue={program?.short_description}
              required
              className={inputClasses}
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Description" htmlFor="description" required error={errors.description?.[0]}>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={program?.description}
              required
              className={inputClasses}
            />
          </FormField>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Date" htmlFor="date" required error={errors.date?.[0]}>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={program?.date}
            required
            className={inputClasses}
          />
        </FormField>
        <FormField label="Start Time" htmlFor="start_time" error={errors.start_time?.[0]}>
          <input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={program?.start_time ?? ""}
            className={inputClasses}
          />
        </FormField>
        <FormField label="End Time" htmlFor="end_time" error={errors.end_time?.[0]}>
          <input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={program?.end_time ?? ""}
            className={inputClasses}
          />
        </FormField>

        <FormField label="Venue" htmlFor="venue" error={errors.venue?.[0]}>
          <input id="venue" name="venue" defaultValue={program?.venue ?? ""} className={inputClasses} />
        </FormField>
        <div className="lg:col-span-2">
          <FormField label="Address" htmlFor="address" error={errors.address?.[0]}>
            <input id="address" name="address" defaultValue={program?.address ?? ""} className={inputClasses} />
          </FormField>
        </div>

        <FormField label="City" htmlFor="city" required error={errors.city?.[0]}>
          <input
            id="city"
            name="city"
            defaultValue={program?.city ?? "Hinganghat"}
            required
            className={inputClasses}
          />
        </FormField>

        <FormField label="Category" htmlFor="category" required error={errors.category?.[0]}>
          <select
            id="category"
            name="category"
            defaultValue={program?.category ?? "community-welfare"}
            required
            className={inputClasses}
          >
            {PROGRAM_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Status" htmlFor="status" required error={errors.status?.[0]}>
          <select
            id="status"
            name="status"
            value={status}
            required
            className={inputClasses}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </FormField>

        <FormField
          label="Registration Link"
          htmlFor="registration_link"
          error={errors.registration_link?.[0]}
        >
          <input
            id="registration_link"
            name="registration_link"
            type="url"
            defaultValue={program?.registration_link ?? ""}
            className={inputClasses}
            placeholder="https://"
          />
        </FormField>

        <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium text-brand-ink">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={program?.featured ?? false}
            className="h-4 w-4 rounded border-brand-ink/30 text-brand focus:ring-brand"
          />
          Featured program
        </label>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">Cover Image</h2>
        <ImageUploader
          label="Program cover image"
          value={coverImage}
          onChange={setCoverImage}
          pathFor={(fileName) => programCoverPath(tempIdForUpload, fileName)}
        />
        <input type="hidden" name="cover_image" value={coverImage ?? ""} />
      </section>

      {status === "completed" ? (
        <section className="flex flex-col gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
            Program Report
          </h2>
          <p className="-mt-3 text-xs text-brand-muted">
            Shown on the public program page once the program is marked completed. Leave blank to
            hide a section.
          </p>

          <FormField label="Summary" htmlFor="summary" error={errors.summary?.[0]}>
            <textarea id="summary" name="summary" rows={3} defaultValue={program?.summary ?? ""} className={inputClasses} />
          </FormField>
          <FormField label="Objectives" htmlFor="objectives" error={errors.objectives?.[0]}>
            <textarea id="objectives" name="objectives" rows={3} defaultValue={program?.objectives ?? ""} className={inputClasses} />
          </FormField>
          <FormField label="Activities" htmlFor="activities" error={errors.activities?.[0]}>
            <textarea id="activities" name="activities" rows={3} defaultValue={program?.activities ?? ""} className={inputClasses} />
          </FormField>
          <FormField label="Outcomes" htmlFor="outcomes" error={errors.outcomes?.[0]}>
            <textarea id="outcomes" name="outcomes" rows={3} defaultValue={program?.outcomes ?? ""} className={inputClasses} />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Participants" htmlFor="participant_count" error={errors.participant_count?.[0]}>
              <input
                id="participant_count"
                name="participant_count"
                type="number"
                min={0}
                defaultValue={program?.participant_count ?? ""}
                className={inputClasses}
              />
            </FormField>
            <FormField label="Volunteers" htmlFor="volunteer_count" error={errors.volunteer_count?.[0]}>
              <input
                id="volunteer_count"
                name="volunteer_count"
                type="number"
                min={0}
                defaultValue={program?.volunteer_count ?? ""}
                className={inputClasses}
              />
            </FormField>
            <FormField label="Beneficiaries" htmlFor="beneficiary_count" error={errors.beneficiary_count?.[0]}>
              <input
                id="beneficiary_count"
                name="beneficiary_count"
                type="number"
                min={0}
                defaultValue={program?.beneficiary_count ?? ""}
                className={inputClasses}
              />
            </FormField>
          </div>
        </section>
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

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {isPending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
