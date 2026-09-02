import type { Metadata } from "next";
import { getContactSubmissions } from "@/lib/data/admin";
import { deleteContactSubmission, updateContactStatus } from "@/actions/admin";
import { formatSubmittedAt } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Contact Messages", robots: { index: false } };

export default async function AdminContactsPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Contact Messages</h1>
        <p className="text-sm text-brand-muted">Messages submitted through the contact form.</p>
      </div>

      <DataTable
        rows={submissions}
        rowKey={(s) => s.id}
        emptyMessage="No contact messages yet."
        columns={[
          {
            header: "From",
            cell: (s) => (
              <div>
                <p className="font-medium text-brand-ink">{s.name}</p>
                <a href={`mailto:${s.email}`} className="text-xs text-brand-deep hover:underline">
                  {s.email}
                </a>
              </div>
            ),
          },
          {
            header: "Message",
            cell: (s) => (
              <div className="max-w-xs">
                <p className="font-medium text-brand-ink">{s.subject}</p>
                <p className="line-clamp-2 text-xs text-brand-muted">{s.message}</p>
              </div>
            ),
          },
          { header: "Submitted", cell: (s) => formatSubmittedAt(s.created_at) },
          {
            header: "Status",
            cell: (s) => (
              <StatusSelect
                status={s.status}
                options={["new", "read", "archived"]}
                onChange={updateContactStatus.bind(null, s.id)}
              />
            ),
          },
          {
            header: "",
            className: "text-right",
            cell: (s) => (
              <DeleteButton
                action={deleteContactSubmission.bind(null, s.id)}
                confirmMessage="Delete this message?"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
