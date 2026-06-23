import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/gracias"] },
    sitemap: "https://www.monkeia.com/sitemap.xml",
  };
}
