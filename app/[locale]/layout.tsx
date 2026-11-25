import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource/noto-sans-telugu/500.css";
import "@fontsource/noto-sans-telugu/600.css";
import "@fontsource/noto-sans-devanagari/500.css";
import "@fontsource/noto-sans-devanagari/600.css";
import "../globals.css";
import { isLocale, locales, localeNames, siteUrl, type Locale } from "@/lib/i18n";
import { getDict } from "@/lib/dict";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ScrollUi } from "@/components/ScrollUi";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.defaultTitle, template: `%s · ${t.meta.siteName}` },
    description: t.meta.defaultDescription,
    applicationName: "Air Indo",
    manifest: "/manifest.webmanifest",
    formatDetection: { telephone: false },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#10215C",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Airline",
  name: "Air Indo Airlines",
  alternateName: "Air Indo",
  url: siteUrl,
  logo: `${siteUrl}/brand/android-512.png`,
  slogan: "Fly Beyond",
  founder: { "@type": "Person", name: "Srinivas Chilukuri" },
  areaServed: "IN",
  address: { "@type": "PostalAddress", addressRegion: "Andhra Pradesh", addressCountry: "IN" },
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale as Locale);
  return (
    <html lang={localeNames[locale as Locale].htmlLang}>
      <body>
        <a className="skip" href="#main">
          {t.nav.skip}
        </a>
        <div className="statusbar">
          <div className="wrap">
            <span className="pulse" aria-hidden="true" />
            <span className="status-long">{t.status.text}</span>
            <span className="status-short">{t.status.short}</span>
            <a href={`/${locale}#progress`}>{t.status.link} →</a>
          </div>
        </div>
        <Header locale={locale as Locale} t={t.nav} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale as Locale} t={t} />
        <Reveal />
        <ScrollUi label={t.common.backToTop} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
