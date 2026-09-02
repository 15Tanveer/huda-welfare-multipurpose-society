import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-brand-ink">Not found</h1>
      <p className="max-w-md text-brand-muted">
        The item you&apos;re looking for doesn&apos;t exist or may have been deleted.
      </p>
      <Link href="/admin/dashboard" className="text-sm font-semibold text-brand hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
