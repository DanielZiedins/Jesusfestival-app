import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
import { INDEXABLE_ROUTES } from "@/lib/routes";
import { sortedPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const app: MetadataRoute.Sitemap = INDEXABLE_ROUTES.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    changeFrequency: path === "/news" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path === "/schedule" || path === "/map" ? 0.9 : 0.75,
  }));

  const posts = sortedPosts();
  const blog: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/network`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...app, ...blog];
}
