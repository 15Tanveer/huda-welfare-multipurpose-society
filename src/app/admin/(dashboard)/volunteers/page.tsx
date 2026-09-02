import type { Metadata } from "next";
import { getVolunteerSubmissions } from "@/lib/data/admin";
import { deleteVolunteerSubmission, updateVolunteerStatus } from "@/actions/admin";
import { formatSubmittedAt } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Volunteer Requests", robots: { index: false } };

export default async function AdminVolunteersPage() {
  const submissions = await getVolunteerSubmissions();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Volunteer Requests</h1>
        <p className="text-sm text-brand-muted">
          People who have expressed interest in volunteering with HUDA. Not visible publicly.
        </p>
      </div>

      <DataTable
        rows={submissions}
        rowKey={(s) => s.id}
        emptyMessage="No volunteer requests yet."
        columns={[
          {
            header: "Name",
            cell: (s) => (
              <div>
                <p className="font-medium text-brand-ink">{s.full_name}</p>
                <p className="text-xs text-brand-muted">{s.city}</p>
              </div>
            ),
          },
          {
            header: "Contact",
            cell: (s) => (
              <div className="text-xs">
                <a href={`mailto:${s.email}`} className="block text-brand-deep hover:underline">
                  {s.email}
                </a>
                <a href={`tel:${s.phone}`} className="block text-brand-muted hover:text-brand-deep">
                  {s.phone}
                </a>
              </div>
            ),
          },
          { header: "Interest", cell: (s) => s.area_of_interest },
          { header: "Submitted", cell: (s) => formatSubmittedAt(s.created_at) },
          {
            header: "Status",
            cell: (s) => (
              <StatusSelect
                status={s.status}
                options={["new", "contacted", "archived"]}
                onChange={updateVolunteerStatus.bind(null, s.id)}
              />
            ),
          },
          {
            header: "",
            className: "text-right",
            cell: (s) => (
              <DeleteButton
                action={deleteVolunteerSubmission.bind(null, s.id)}
                confirmMessage="Delete this volunteer request?"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
