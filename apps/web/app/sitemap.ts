import type { MetadataRoute } from "next";

const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/converter", priority: 0.9 },
  { path: "/detector", priority: 0.9 },
  { path: "/alifbo", priority: 0.8 },
  { path: "/tarix", priority: 0.7 },
  { path: "/maxfiylik", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `https://imlogram.uz${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
