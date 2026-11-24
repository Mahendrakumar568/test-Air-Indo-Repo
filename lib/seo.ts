import type { Metadata } from "next";
import { locales, localeNames, siteUrl, type Locale } from "./i18n";
import { getDict } from "./dict";
import { ogImages } from "./images";

type PageKey = keyof ReturnType<typeof getDict>["meta"]["pages"];

/** Canonical URL, hreflang alternates and Open Graph for a page. `path` has no locale prefix ("" for home). */
export function pageMeta(
  locale: Locale,
  path: string,
  opts: { page?: PageKey; title?: string; description?: string; og?: keyof typeof ogImages; type?: "website" | "article" } = {},
): Metadata {
  const t = getDict(locale);
  const [pTitle, pDesc] = opts.page ? t.meta.pages[opts.page] : [undefined, undefined];
  const title = opts.title ?? pTitle;
  const description = opts.description ?? pDesc ?? t.meta.defaultDescription;
  const languages = Object.fromEntries(locales.map((l) => [localeNames[l].htmlLang, `${siteUrl}/${l}${path}`]));
  const image = ogImages[opts.og ?? "default"];
  return {
    title: title ? title : { absolute: t.meta.defaultTitle },
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}${path}`,
      languages: { ...languages, "x-default": `${siteUrl}/en${path}` },
    },
    openGraph: {
      type: opts.type ?? "website",
      siteName: "Air Indo",
      title: title ? `${title} · Air Indo` : t.meta.defaultTitle,
      description,
      url: `${siteUrl}/${locale}${path}`,
      locale: localeNames[locale].htmlLang.replace("-", "_"),
      images: [{ url: image, width: 1200, height: 630, alt: "Air Indo · Fly Beyond" }],
    },
    twitter: { card: "summary_large_image", title: title ?? t.meta.defaultTitle, description, images: [image] },
  };
}
