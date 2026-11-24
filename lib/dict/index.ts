import "server-only";
import type { Locale } from "../i18n";
import en, { type Dict } from "./en";
import te from "./te";
import hi from "./hi";

const dictionaries: Record<Locale, Dict> = { en, te, hi };

export const getDict = (locale: Locale): Dict => dictionaries[locale] ?? en;
export type { Dict };
