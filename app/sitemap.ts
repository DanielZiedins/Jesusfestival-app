import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
import { INDEXABLE_ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    changeFrequency: path === "/news" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path === "/schedule" || path === "/map" ? 0.9 : 0.75,
  }));
}
