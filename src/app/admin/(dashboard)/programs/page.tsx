import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { getAdminProgramList } from "@/lib/data/programs";
import { deleteProgram } from "@/actions/programs";
import { formatProgramDateShort } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Programs", robots: { index: false } };

export default async function AdminProgramsPage() {
  const programs = await getAdminProgramList();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-ink">Programs</h1>
          <p className="text-sm text-brand-muted">Manage HUDA&apos;s community programs.</p>
        </div>
        <Link
          href="/admin/programs/new"
          className="rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f3d22]"
        >
          + New Program
        </Link>
      </div>

      <DataTable
        rows={programs}
        rowKey={(p) => p.id}
        emptyMessage="No programs yet. Create your first one to get started."
        columns={[
          {
            header: "Title",
            cell: (p) => (
              <div className="flex items-center gap-2">
                {p.featured ? <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" aria-hidden="true" /> : null}
                <span className="font-medium text-brand-ink">{p.title}</span>
              </div>
            ),
          },
          { header: "Date", cell: (p) => formatProgramDateShort(p.date) },
          { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
          { header: "City", cell: (p) => p.city },
          {
            header: "",
            className: "text-right",
            cell: (p) => (
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/programs/${p.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-brand-deep hover:bg-brand-light"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </Link>
                <DeleteButton
                  action={deleteProgram.bind(null, p.id)}
                  confirmMessage={`Delete "${p.title}"? This cannot be undone.`}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
