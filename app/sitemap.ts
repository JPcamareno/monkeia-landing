import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.monkeia.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/diagnostico`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/diagnostico-b2c`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
