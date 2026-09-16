import type { Metadata } from "next";
import { getNewsletterSubscribers } from "@/lib/data/admin";
import { deleteNewsletterSubscriber } from "@/actions/admin";
import { formatSubmittedAt } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { NewsletterExportButton } from "@/components/admin/NewsletterExportButton";

export const metadata: Metadata = { title: "Newsletter Subscribers", robots: { index: false } };

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-ink">Newsletter Subscribers</h1>
          <p className="text-sm text-brand-muted">
            People who signed up for updates from the public site. Not visible publicly.
          </p>
        </div>
        <NewsletterExportButton subscribers={subscribers} />
      </div>

      <DataTable
        rows={subscribers}
        rowKey={(s) => s.id}
        emptyMessage="No newsletter subscribers yet."
        columns={[
          {
            header: "Email",
            cell: (s) => (
              <a href={`mailto:${s.email}`} className="text-brand-deep hover:underline">
                {s.email}
              </a>
            ),
          },
          { header: "Subscribed", cell: (s) => formatSubmittedAt(s.created_at) },
          {
            header: "",
            className: "text-right",
            cell: (s) => (
              <DeleteButton
                action={deleteNewsletterSubscriber.bind(null, s.id)}
                confirmMessage="Remove this subscriber?"
                label="Remove"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
