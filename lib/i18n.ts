export const locales = ["en", "te", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { short: string; native: string; htmlLang: string }> = {
  en: { short: "EN", native: "English", htmlLang: "en-IN" },
  te: { short: "తె", native: "తెలుగు", htmlLang: "te-IN" },
  hi: { short: "हि", native: "हिन्दी", htmlLang: "hi-IN" },
};

export const isLocale = (value: string | undefined): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://airindo.in").replace(/\/$/, "");

/** Build a locale-prefixed href. `path` starts with "/" or is "" for home. */
export const href = (locale: Locale, path = "") => `/${locale}${path === "/" ? "" : path}`;
