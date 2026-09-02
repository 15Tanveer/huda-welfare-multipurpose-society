import type { MetadataRoute } from "next";
import { getAllProgramSlugs } from "@/lib/data/programs";
import { getAllActiveResourceSlugs } from "@/lib/data/resources";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_ROUTES = [
  "",
  "/about",
  "/our-work",
  "/programs",
  "/resources",
  "/gallery",
  "/get-involved",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [programSlugs, resourceSlugs] = await Promise.all([
    getAllProgramSlugs(),
    getAllActiveResourceSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));

  const programEntries: MetadataRoute.Sitemap = programSlugs.map((slug) => ({
    url: `${siteUrl}/programs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const resourceEntries: MetadataRoute.Sitemap = resourceSlugs.map((slug) => ({
    url: `${siteUrl}/resources/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...programEntries, ...resourceEntries];
}
