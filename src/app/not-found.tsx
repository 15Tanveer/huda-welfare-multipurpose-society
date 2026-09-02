import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-off-white px-6 text-center">
      <h1 className="text-3xl font-semibold text-brand-ink">Page not found</h1>
      <p className="max-w-md text-brand-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/" className="text-sm font-semibold text-brand hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
