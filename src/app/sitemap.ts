import type { MetadataRoute } from "next";
import { getAllProgramSlugs } from "@/lib/data/programs";

const STATIC_ROUTES = [
  "",
  "/about",
  "/our-work",
  "/programs",
  "/gallery",
  "/get-involved",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const slugs = await getAllProgramSlugs();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));

  const programEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/programs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...programEntries];
}
