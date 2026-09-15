import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.monkeia.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/casos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/casos/latina-pizza`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
