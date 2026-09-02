import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

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
