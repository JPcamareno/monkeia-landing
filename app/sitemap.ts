import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.monkeia.com";
  return [{ url: base, changeFrequency: "weekly", priority: 1 }];
}
