import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResourceById } from "@/lib/data/resources";
import { updateResource } from "@/actions/resources";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const metadata: Metadata = { title: "Edit Resource", robots: { index: false } };

interface EditResourcePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = await params;
  const resource = await getResourceById(id);

  if (!resource) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Edit Resource</h1>
        <p className="text-sm text-brand-muted">{resource.title}</p>
      </div>

      <ResourceForm
        resource={resource}
        action={updateResource.bind(null, resource.id)}
        submitLabel="Save Changes"
      />
    </div>
  );
}
