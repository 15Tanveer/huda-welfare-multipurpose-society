import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header shortName={settings.short_name} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
