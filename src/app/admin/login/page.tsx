import type { Metadata } from "next";
import { LogoMark } from "@/components/icons/LogoMark";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

interface AdminLoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-deep px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-deep text-white">
            <LogoMark className="h-8 w-8" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-brand-ink">HUDA Admin</h1>
            <p className="text-sm text-brand-muted">Sign in to manage the website.</p>
          </div>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
