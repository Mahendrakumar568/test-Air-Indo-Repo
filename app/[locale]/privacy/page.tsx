import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { privacy } from "@/lib/legal";
import { Legal } from "@/components/Legal";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/privacy", { page: "privacy" }) : {};
}

export default async function Privacy({ params }: PageProps) {
  const { t } = await resolve(params);
  return <Legal t={t} title={t.meta.pages.privacy[0]} sections={privacy} />;
}
