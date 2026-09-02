import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";
import { getSiteSettings } from "@/lib/settings";
import { organizationJsonLd } from "@/lib/structured-data";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings.organization_name;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name} | ${settings.city}, ${settings.state}`,
      template: `%s | ${settings.short_name}`,
    },
    description:
      settings.tagline ??
      "A community welfare and educational organization working for education, healthcare, empowerment and social welfare.",
    openGraph: {
      type: "website",
      siteName: name,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const jsonLd = organizationJsonLd(settings);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-brand-off-white text-brand-ink">
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
