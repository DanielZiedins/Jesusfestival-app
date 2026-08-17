import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
import { INDEXABLE_ROUTES } from "@/lib/routes";
import { sortedPosts } from "@/lib/blog";
import { FESTIVAL_GUIDE_PATH, LAST_MAJOR_UPDATE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const majorUpdate = new Date(`${LAST_MAJOR_UPDATE}T12:00:00Z`);
  const app: MetadataRoute.Sitemap = INDEXABLE_ROUTES.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    lastModified: majorUpdate,
    changeFrequency: path === "/news" ? "daily" : "weekly",
    priority:
      path === "/"
        ? 1
        : path === "/schedule" || path === "/map" || path === "/i-said-yes" || path === "/accessibility"
          ? 0.9
          : 0.75,
  }));

  const posts = sortedPosts();
  const blog: MetadataRoute.Sitemap = [
    { url: `${SITE.url}${FESTIVAL_GUIDE_PATH}`, lastModified: majorUpdate, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE.url}/faq`, lastModified: majorUpdate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/network`, lastModified: majorUpdate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: majorUpdate, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...app, ...blog];
}
