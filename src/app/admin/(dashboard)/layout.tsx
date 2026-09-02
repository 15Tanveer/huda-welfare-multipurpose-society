import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

// Defense in depth: every admin page already sets its own noindex metadata,
// this is a safe default for the route group in case a future page forgets.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: proxy.ts already protects /admin/*, this catches any
  // request that reaches here without a valid session.
  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell email={user.email ?? "Admin"}>{children}</AdminShell>;
}
