import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getAllTeamMembers } from "@/lib/data/team";
import { deleteTeamMember } from "@/actions/team";
import { DataTable } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Team", robots: { index: false } };

export default async function AdminTeamPage() {
  const members = await getAllTeamMembers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-ink">Team</h1>
          <p className="text-sm text-brand-muted">Manage the team shown on the About page.</p>
        </div>
        <Link
          href="/admin/team/new"
          className="rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f3d22]"
        >
          + New Member
        </Link>
      </div>

      <DataTable
        rows={members}
        rowKey={(m) => m.id}
        emptyMessage="No team members added yet."
        columns={[
          { header: "Name", cell: (m) => <span className="font-medium text-brand-ink">{m.name}</span> },
          { header: "Role", cell: (m) => m.role },
          {
            header: "Status",
            cell: (m) => (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  m.is_active ? "bg-brand-light text-brand-deep" : "bg-slate-100 text-slate-500"
                }`}
              >
                {m.is_active ? "Active" : "Hidden"}
              </span>
            ),
          },
          {
            header: "",
            className: "text-right",
            cell: (m) => (
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/team/${m.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-brand-deep hover:bg-brand-light"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </Link>
                <DeleteButton
                  action={deleteTeamMember.bind(null, m.id)}
                  confirmMessage={`Remove "${m.name}" from the team?`}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
