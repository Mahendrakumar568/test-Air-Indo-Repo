import type { MetadataRoute } from "next";
import { locales, localeNames, siteUrl } from "@/lib/i18n";
import { cityList, newsPosts } from "@/lib/data";

const paths = [
  "", "/about", "/routes", "/fleet", "/experience", "/cargo", "/investors", "/careers", "/newsroom", "/contact", "/privacy", "/terms",
  ...cityList.map((c) => `/routes/${c.slug}`),
  ...newsPosts.map((p) => `/newsroom/${p.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.flatMap((p) =>
    locales.map((l) => ({
      url: `${siteUrl}/${l}${p}`,
      lastModified: now,
      changeFrequency: p === "" || p === "/newsroom" ? ("weekly" as const) : ("monthly" as const),
      priority: p === "" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((x) => [localeNames[x].htmlLang, `${siteUrl}/${x}${p}`])) },
    })),
  );
}
