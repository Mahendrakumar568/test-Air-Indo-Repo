import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { terms } from "@/lib/legal";
import { Legal } from "@/components/Legal";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/terms", { page: "terms" }) : {};
}

export default async function Terms({ params }: PageProps) {
  const { t } = await resolve(params);
  return <Legal t={t} title={t.meta.pages.terms[0]} sections={terms} />;
}
