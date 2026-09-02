"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-off-white">
      <aside className="hidden w-64 shrink-0 bg-brand-deep px-4 py-6 lg:flex">
        <AdminSidebar className="w-full" />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-brand-ink/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex w-64 flex-col bg-brand-deep px-4 py-6">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <AdminSidebar className="w-full" />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-brand-ink/10 bg-white px-4 py-3 lg:justify-end lg:px-8">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-deep hover:bg-brand-light lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-sm text-brand-muted">{email}</span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
