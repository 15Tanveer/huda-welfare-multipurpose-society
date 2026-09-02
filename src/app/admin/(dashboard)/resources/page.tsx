import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { getAdminResourceList } from "@/lib/data/resources";
import { deleteResource } from "@/actions/resources";
import { resourceCategoryLabel, resourceTypeLabel } from "@/lib/resources-config";
import { formatIsoDateLong } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Resources", robots: { index: false } };

export default async function AdminResourcesPage() {
  const resources = await getAdminResourceList();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-ink">Resources</h1>
          <p className="text-sm text-brand-muted">
            Curated government schemes, scholarships and opportunities.
          </p>
        </div>
        <Link
          href="/admin/resources/new"
          className="rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f3d22]"
        >
          + New Resource
        </Link>
      </div>

      <DataTable
        rows={resources}
        rowKey={(r) => r.id}
        emptyMessage="No resources yet. Add HUDA's first curated scheme or opportunity to get started."
        columns={[
          {
            header: "Title",
            cell: (r) => (
              <div className="flex items-center gap-2">
                {r.featured ? <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" aria-hidden="true" /> : null}
                <span className="font-medium text-brand-ink">{r.title}</span>
              </div>
            ),
          },
          { header: "Type", cell: (r) => resourceTypeLabel(r.resource_type) },
          { header: "Category", cell: (r) => resourceCategoryLabel(r.category) },
          { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
          {
            header: "Last Verified",
            cell: (r) => (r.last_verified_at ? formatIsoDateLong(r.last_verified_at) : "—"),
          },
          {
            header: "",
            className: "text-right",
            cell: (r) => (
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/resources/${r.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-brand-deep hover:bg-brand-light"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </Link>
                <DeleteButton
                  action={deleteResource.bind(null, r.id)}
                  confirmMessage={`Delete "${r.title}"? This cannot be undone.`}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
