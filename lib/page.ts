import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./i18n";
import { getDict } from "./dict";
import { cityList, type CityCode } from "./data";

export type PageProps = { params: Promise<{ locale: string }> };

/** Resolve and validate the locale param, returning the locale and its dictionary. */
export async function resolve(params: PageProps["params"]) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale as Locale);
  const names = Object.fromEntries(cityList.map((c) => [c.code, t.cities[c.code].name])) as Record<CityCode, string>;
  return { locale: locale as Locale, t, names };
}
