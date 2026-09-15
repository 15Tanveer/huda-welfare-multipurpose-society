"use client";

import { useActionState, useEffect, useId, useRef, useState, type ChangeEvent } from "react";
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

// Plain text/number/date fields kept as controlled inputs, backed by this
// object, rather than `defaultValue`. React resets every *uncontrolled*
// form field after a form action call resolves — including on a failed
// validation attempt — so with `defaultValue` a rejected submission
// silently wiped everything the admin had typed except the handful of
// fields (slug, status, cover image) that already happened to be
// controlled. Controlled fields are immune to that reset: their value
// always comes back from this state, which nothing here clears on
// failure.
interface TextFieldValues {
  title: string;
  short_description: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  address: string;
  city: string;
  registration_link: string;
  summary: string;
  objectives: string;
  activities: string;
  outcomes: string;
  participant_count: string;
  volunteer_count: string;
  beneficiary_count: string;
}

function initialTextValues(program?: ProgramRow): TextFieldValues {
  return {
    title: program?.title ?? "",
    short_description: program?.short_description ?? "",
    description: program?.description ?? "",
    date: program?.date ?? "",
    start_time: program?.start_time ?? "",
    end_time: program?.end_time ?? "",
    venue: program?.venue ?? "",
    address: program?.address ?? "",
    city: program?.city ?? "Hinganghat",
    registration_link: program?.registration_link ?? "",
    summary: program?.summary ?? "",
    objectives: program?.objectives ?? "",
    activities: program?.activities ?? "",
    outcomes: program?.outcomes ?? "",
    participant_count: program?.participant_count?.toString() ?? "",
    volunteer_count: program?.volunteer_count?.toString() ?? "",
    beneficiary_count: program?.beneficiary_count?.toString() ?? "",
  };
}

// Field order matches the form's visual top-to-bottom layout, so scrolling
// to the first key present in fieldErrors lands on whichever invalid
// field actually appears first on the page.
const FIELD_ORDER = [
  "title",
  "slug",
  "short_description",
  "description",
  "date",
  "start_time",
  "end_time",
  "venue",
  "address",
  "city",
  "category",
  "status",
  "registration_link",
  "summary",
  "objectives",
  "activities",
  "outcomes",
  "participant_count",
  "volunteer_count",
  "beneficiary_count",
];

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
  const [category, setCategory] = useState(program?.category ?? "community-rural-development");
  const [featured, setFeatured] = useState(program?.featured ?? false);
  const [values, setValues] = useState<TextFieldValues>(() => initialTextValues(program));

  const errors = state.fieldErrors ?? {};
  const draftId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tempIdForUpload = program?.id ?? `draft-${draftId}`;

  const lastErrorState = useRef<ActionResult | undefined>(undefined);
  useEffect(() => {
    if (state === lastErrorState.current) return;
    lastErrorState.current = state;
    if (!state.fieldErrors) return;
    const firstInvalidField = FIELD_ORDER.find((name) => state.fieldErrors?.[name]);
    if (!firstInvalidField) return;
    const el = document.getElementById(firstInvalidField);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus();
  }, [state]);

  const setField = (key: keyof TextFieldValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title" required error={errors.title?.[0]}>
          <input
            id="title"
            name="title"
            value={values.title}
            required
            className={inputClasses}
            onChange={(e) => {
              setField("title")(e);
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
              value={values.short_description}
              required
              className={inputClasses}
              onChange={setField("short_description")}
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Description" htmlFor="description" required error={errors.description?.[0]}>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={values.description}
              required
              className={inputClasses}
              onChange={setField("description")}
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
            value={values.date}
            required
            className={inputClasses}
            onChange={setField("date")}
          />
        </FormField>
        <FormField label="Start Time" htmlFor="start_time" error={errors.start_time?.[0]}>
          <input
            id="start_time"
            name="start_time"
            type="time"
            value={values.start_time}
            className={inputClasses}
            onChange={setField("start_time")}
          />
        </FormField>
        <FormField label="End Time" htmlFor="end_time" error={errors.end_time?.[0]}>
          <input
            id="end_time"
            name="end_time"
            type="time"
            value={values.end_time}
            className={inputClasses}
            onChange={setField("end_time")}
          />
        </FormField>

        <FormField label="Venue" htmlFor="venue" error={errors.venue?.[0]}>
          <input
            id="venue"
            name="venue"
            value={values.venue}
            className={inputClasses}
            onChange={setField("venue")}
          />
        </FormField>
        <div className="lg:col-span-2">
          <FormField label="Address" htmlFor="address" error={errors.address?.[0]}>
            <input
              id="address"
              name="address"
              value={values.address}
              className={inputClasses}
              onChange={setField("address")}
            />
          </FormField>
        </div>

        <FormField label="City" htmlFor="city" required error={errors.city?.[0]}>
          <input
            id="city"
            name="city"
            value={values.city}
            required
            className={inputClasses}
            onChange={setField("city")}
          />
        </FormField>

        <FormField label="Category" htmlFor="category" required error={errors.category?.[0]}>
          <select
            id="category"
            name="category"
            value={category}
            required
            className={inputClasses}
            onChange={(e) => setCategory(e.target.value as typeof category)}
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
            value={values.registration_link}
            className={inputClasses}
            placeholder="https://"
            onChange={setField("registration_link")}
          />
        </FormField>

        <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium text-brand-ink">
          <input
            type="checkbox"
            name="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
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
            <textarea
              id="summary"
              name="summary"
              rows={3}
              value={values.summary}
              className={inputClasses}
              onChange={setField("summary")}
            />
          </FormField>
          <FormField label="Objectives" htmlFor="objectives" error={errors.objectives?.[0]}>
            <textarea
              id="objectives"
              name="objectives"
              rows={3}
              value={values.objectives}
              className={inputClasses}
              onChange={setField("objectives")}
            />
          </FormField>
          <FormField label="Activities" htmlFor="activities" error={errors.activities?.[0]}>
            <textarea
              id="activities"
              name="activities"
              rows={3}
              value={values.activities}
              className={inputClasses}
              onChange={setField("activities")}
            />
          </FormField>
          <FormField label="Outcomes" htmlFor="outcomes" error={errors.outcomes?.[0]}>
            <textarea
              id="outcomes"
              name="outcomes"
              rows={3}
              value={values.outcomes}
              className={inputClasses}
              onChange={setField("outcomes")}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Participants" htmlFor="participant_count" error={errors.participant_count?.[0]}>
              <input
                id="participant_count"
                name="participant_count"
                type="number"
                min={0}
                value={values.participant_count}
                className={inputClasses}
                onChange={setField("participant_count")}
              />
            </FormField>
            <FormField label="Volunteers" htmlFor="volunteer_count" error={errors.volunteer_count?.[0]}>
              <input
                id="volunteer_count"
                name="volunteer_count"
                type="number"
                min={0}
                value={values.volunteer_count}
                className={inputClasses}
                onChange={setField("volunteer_count")}
              />
            </FormField>
            <FormField label="Beneficiaries" htmlFor="beneficiary_count" error={errors.beneficiary_count?.[0]}>
              <input
                id="beneficiary_count"
                name="beneficiary_count"
                type="number"
                min={0}
                value={values.beneficiary_count}
                className={inputClasses}
                onChange={setField("beneficiary_count")}
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
