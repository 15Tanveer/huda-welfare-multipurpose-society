import type { ProgramStatus, ResourceStatus, SubmissionStatus } from "@/types/database";

type Status = ProgramStatus | SubmissionStatus | ResourceStatus;

const styles: Record<Status, string> = {
  upcoming: "bg-brand-light text-brand-deep",
  completed: "bg-brand-deep/10 text-brand-deep",
  cancelled: "bg-red-50 text-red-700",
  new: "bg-amber-50 text-amber-700",
  contacted: "bg-brand-light text-brand-deep",
  read: "bg-slate-100 text-slate-600",
  archived: "bg-slate-100 text-slate-500",
  active: "bg-brand-light text-brand-deep",
  "needs-verification": "bg-amber-50 text-amber-700",
};

const labels: Record<Status, string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
  new: "New",
  contacted: "Contacted",
  read: "Read",
  archived: "Archived",
  active: "Active",
  "needs-verification": "Needs Verification",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
