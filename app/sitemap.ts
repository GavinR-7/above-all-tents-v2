import type { MetadataRoute } from "next";
import { routes, siteUrl } from "@/data/site";

// No lastModified on purpose: `new Date()` would stamp every URL as changed on
// every build, which teaches Google to ignore the field. Omitted is honest.
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));
}
