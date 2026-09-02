import type { Metadata } from "next";
import { createResource } from "@/actions/resources";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const metadata: Metadata = { title: "New Resource", robots: { index: false } };

export default function NewResourcePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">New Resource</h1>
        <p className="text-sm text-brand-muted">
          Add a scheme, scholarship or opportunity for the public Resources page.
        </p>
      </div>

      <ResourceForm action={createResource} submitLabel="Create Resource" />
    </div>
  );
}
