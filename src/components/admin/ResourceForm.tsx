"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import type { ResourceRow } from "@/types/database";
import {
  AUDIENCE_TAGS,
  RESOURCE_CATEGORIES,
  RESOURCE_SCOPES,
  RESOURCE_STATUSES,
  RESOURCE_TYPES,
} from "@/lib/resources-config";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

type ResourceAction = (
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

/** ISO timestamp -> "yyyy-MM-dd" for a `type="date"` input's defaultValue/value. */
function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function ResourceForm({
  resource,
  action,
  submitLabel,
}: {
  resource?: ResourceRow;
  action: ResourceAction;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [slugEdited, setSlugEdited] = useState(Boolean(resource));
  const [slug, setSlug] = useState(resource?.slug ?? "");
  const [lastVerifiedAt, setLastVerifiedAt] = useState(toDateInputValue(resource?.last_verified_at ?? null));

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title" required error={errors.title?.[0]}>
          <input
            id="title"
            name="title"
            defaultValue={resource?.title}
            required
            className={inputClasses}
            onChange={(e) => {
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" required error={errors.slug?.[0]} hint="Used in the resource URL">
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
            hint="Shown on resource cards and used as the page's SEO description"
          >
            <input
              id="short_description"
              name="short_description"
              defaultValue={resource?.short_description}
              required
              className={inputClasses}
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Overview" htmlFor="description" error={errors.description?.[0]} hint="Optional — a longer summary shown on the detail page">
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={resource?.description ?? ""}
              className={inputClasses}
            />
          </FormField>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Resource Type" htmlFor="resource_type" required error={errors.resource_type?.[0]}>
          <select
            id="resource_type"
            name="resource_type"
            defaultValue={resource?.resource_type ?? "government-scheme"}
            required
            className={inputClasses}
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Category" htmlFor="category" required error={errors.category?.[0]}>
          <select
            id="category"
            name="category"
            defaultValue={resource?.category ?? "education-scholarships"}
            required
            className={inputClasses}
          >
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Scope" htmlFor="scope" required error={errors.scope?.[0]}>
          <select
            id="scope"
            name="scope"
            defaultValue={resource?.scope ?? "maharashtra"}
            required
            className={inputClasses}
          >
            {RESOURCE_SCOPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="State (optional)" htmlFor="state" error={errors.state?.[0]} hint="Only needed if Scope is not already specific enough">
          <input id="state" name="state" defaultValue={resource?.state ?? ""} className={inputClasses} />
        </FormField>

        <FormField label="Provided By" htmlFor="provided_by" error={errors.provided_by?.[0]} hint="e.g. Ministry of Education, Government of Maharashtra">
          <input id="provided_by" name="provided_by" defaultValue={resource?.provided_by ?? ""} className={inputClasses} />
        </FormField>

        <div className="sm:col-span-2 lg:col-span-1">
          <FormField label="Official Source Link" htmlFor="official_url" error={errors.official_url?.[0]} hint="The official government information page — HUDA never hosts an application form">
            <input
              id="official_url"
              name="official_url"
              type="url"
              defaultValue={resource?.official_url ?? ""}
              className={inputClasses}
              placeholder="https://"
            />
          </FormField>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <FormField
            label="Application URL (optional)"
            htmlFor="application_url"
            error={errors.application_url?.[0]}
            hint="Only fill this in once you've verified it's the current application destination — Maharashtra has moved several schemes to MahaDBT 2.0, so an old link may be wrong. Leave blank to show 'View Official Information' instead of 'Apply Now'."
          >
            <input
              id="application_url"
              name="application_url"
              type="url"
              defaultValue={resource?.application_url ?? ""}
              className={inputClasses}
              placeholder="https://"
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField
            label="Audience Tags (optional)"
            htmlFor="audience_tags"
            error={errors.audience_tags?.[0]}
            hint={`Comma-separated. Suggested: ${AUDIENCE_TAGS.join(", ")}`}
          >
            <input
              id="audience_tags"
              name="audience_tags"
              defaultValue={resource?.audience_tags?.join(", ") ?? ""}
              className={inputClasses}
              placeholder="Students, Women, General Citizens"
            />
          </FormField>
        </div>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
          Detail Page Content
        </h2>
        <p className="-mt-3 text-xs text-brand-muted">
          Only sections with real content are shown publicly — leave a field blank to hide it.
        </p>

        <FormField label="Who Can Benefit (Audience)" htmlFor="audience" error={errors.audience?.[0]}>
          <input id="audience" name="audience" defaultValue={resource?.audience ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="Eligibility" htmlFor="eligibility" error={errors.eligibility?.[0]}>
          <textarea id="eligibility" name="eligibility" rows={3} defaultValue={resource?.eligibility ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="Benefits" htmlFor="benefits" error={errors.benefits?.[0]}>
          <textarea id="benefits" name="benefits" rows={3} defaultValue={resource?.benefits ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="Documents Required" htmlFor="documents_required" error={errors.documents_required?.[0]}>
          <textarea id="documents_required" name="documents_required" rows={3} defaultValue={resource?.documents_required ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="How to Apply" htmlFor="how_to_apply" error={errors.how_to_apply?.[0]}>
          <textarea id="how_to_apply" name="how_to_apply" rows={3} defaultValue={resource?.how_to_apply ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="Important Notes" htmlFor="important_notes" error={errors.important_notes?.[0]}>
          <textarea id="important_notes" name="important_notes" rows={3} defaultValue={resource?.important_notes ?? ""} className={inputClasses} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6 sm:grid-cols-2">
        <FormField label="Status" htmlFor="status" required error={errors.status?.[0]}>
          <select
            id="status"
            name="status"
            defaultValue={resource?.status ?? "active"}
            required
            className={inputClasses}
          >
            {RESOURCE_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </FormField>

        <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium text-brand-ink">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={resource?.featured ?? false}
            className="h-4 w-4 rounded border-brand-ink/30 text-brand focus:ring-brand"
          />
          Feature on homepage
        </label>

        <FormField
          label="Application Deadline (optional)"
          htmlFor="application_deadline"
          error={errors.application_deadline?.[0]}
          hint="Leave blank if the scheme has no fixed deadline"
        >
          <input
            id="application_deadline"
            name="application_deadline"
            type="datetime-local"
            defaultValue={resource?.application_deadline ? resource.application_deadline.slice(0, 16) : ""}
            className={inputClasses}
          />
        </FormField>

        <FormField
          label="Last Verified"
          htmlFor="last_verified_at"
          error={errors.last_verified_at?.[0]}
          hint="When this information was last confirmed accurate"
        >
          <div className="flex gap-2">
            <input
              id="last_verified_at"
              name="last_verified_at"
              type="date"
              value={lastVerifiedAt}
              onChange={(e) => setLastVerifiedAt(e.target.value)}
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => setLastVerifiedAt(new Date().toISOString().slice(0, 10))}
              className="shrink-0 whitespace-nowrap rounded-lg border border-brand-ink/15 px-3.5 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-light"
            >
              Mark verified today
            </button>
          </div>
        </FormField>
      </section>

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
