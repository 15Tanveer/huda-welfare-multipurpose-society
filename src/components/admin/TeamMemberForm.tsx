"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import type { TeamMemberRow } from "@/types/database";
import { teamPhotoPath } from "@/lib/supabase/storage";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

type TeamAction = (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;

export function TeamMemberForm({
  member,
  action,
  submitLabel,
}: {
  member?: TeamMemberRow;
  action: TeamAction;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [photoUrl, setPhotoUrl] = useState<string | null>(member?.photo_url ?? null);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">
      <ImageUploader
        label="Photo"
        value={photoUrl}
        onChange={setPhotoUrl}
        pathFor={teamPhotoPath}
      />
      <input type="hidden" name="photo_url" value={photoUrl ?? ""} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" required error={errors.name?.[0]}>
          <input id="name" name="name" defaultValue={member?.name} required className={inputClasses} />
        </FormField>
        <FormField label="Role" htmlFor="role" required error={errors.role?.[0]} hint="e.g. Founder, Volunteer Coordinator">
          <input id="role" name="role" defaultValue={member?.role} required className={inputClasses} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Designation (optional)" htmlFor="designation" error={errors.designation?.[0]}>
          <input id="designation" name="designation" defaultValue={member?.designation ?? ""} className={inputClasses} />
        </FormField>
        <FormField label="Display Order" htmlFor="display_order" error={errors.display_order?.[0]}>
          <input
            id="display_order"
            name="display_order"
            type="number"
            defaultValue={member?.display_order ?? 0}
            className={inputClasses}
          />
        </FormField>
      </div>

      <FormField label="Bio (optional)" htmlFor="bio" error={errors.bio?.[0]}>
        <textarea id="bio" name="bio" rows={3} defaultValue={member?.bio ?? ""} className={inputClasses} />
      </FormField>

      <label className="flex w-fit items-center gap-2 text-sm font-medium text-brand-ink">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={member?.is_active ?? true}
          className="h-4 w-4 rounded border-brand-ink/30 text-brand focus:ring-brand"
        />
        Visible on the public About page
      </label>

      {!state.success && state.message ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
