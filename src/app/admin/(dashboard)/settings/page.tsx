import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export const metadata: Metadata = { title: "Site Settings", robots: { index: false } };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Site Settings</h1>
        <p className="text-sm text-brand-muted">
          Update organization details shown across the public website. Leave a field blank to
          hide it.
        </p>
      </div>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
