import Link from "next/link";
import { ShareBar } from "@/components/ShareBar";
import { notFound } from "next/navigation";
import { resolve } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale, locales, siteUrl } from "@/lib/i18n";
import { getDict } from "@/lib/dict";
import { newsPosts, type NewsSlug } from "@/lib/data";
import { Img } from "@/components/Img";
import { Icon } from "@/components/Icon";

type Props = { params: Promise<{ locale: string; slug: string }> };
const find = (slug: string) => newsPosts.find((p) => p.slug === slug);

export function generateStaticParams() {
  return locales.flatMap((locale) => newsPosts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const p = find(slug);
  if (!isLocale(locale) || !p) return {};
  const post = getDict(locale).newsroom.posts[p.slug];
  return pageMeta(locale, `/newsroom/${slug}`, { title: post.title, description: post.excerpt, type: "article" });
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const { locale, t } = await resolve(params);
  const p = find(slug);
  if (!p) notFound();
  const post = t.newsroom.posts[p.slug as NewsSlug];
  const others = newsPosts.filter((x) => x.slug !== p.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: "Air Indo Airlines", logo: { "@type": "ImageObject", url: `${siteUrl}/brand/android-512.png` } },
    mainEntityOfPage: `${siteUrl}/${locale}/newsroom/${p.slug}`,
  };

  return (
    <>
      <article>
        <header className="section-sm" style={{ paddingBottom: 32 }}>
          <div className="wrap article">
            <Link href={`/${locale}/newsroom`} className="link-arrow" style={{ border: 0 }}>← {t.nav.newsroom}</Link>
            <span className="kicker" style={{ marginTop: 32 }}>{t.newsroom.tags[p.tag]} · ~{Math.max(1, Math.round(post.body.join(" ").split(/\s+/).length / 200))} {t.common.minutes}</span>
            <h1 className="h2" style={{ marginTop: 12 }}>{post.title}</h1>
            <p className="lead" style={{ marginTop: 18 }}>{post.excerpt}</p>
            <ShareBar title={post.title} labels={{ share: t.common.share, copy: t.common.copyLink, copied: t.common.copied }} />
          </div>
        </header>
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <div className="media r-16-9"><Img slot={p.image} priority sizes="(max-width: 1040px) 100vw, 1040px" /></div>
        </div>
        <div className="section-sm">
          <div className="wrap article">
            {post.body.map((para, i) => <p key={i}>{para}</p>)}
            <p className="fine" style={{ marginTop: 40 }}>{t.common.notice}</p>
          </div>
        </div>
      </article>
      <section className="section-sm bg-ivory">
        <div className="wrap">
          <h2 className="h3" style={{ marginBottom: 28 }}>{t.newsroom.title}</h2>
          <div className="grid g3">
            {others.map((o) => (
              <Link key={o.slug} href={`/${locale}/newsroom/${o.slug}`} className="news-card reveal">
                <div className="media reveal"><Img slot={o.image} sizes="(max-width: 640px) 100vw, 400px" /></div>
                <span className="kicker tag">{t.newsroom.tags[o.tag]}</span>
                <h3>{t.newsroom.posts[o.slug].title}</h3>
                <span className="link-arrow" style={{ marginTop: 12, alignSelf: "flex-start" }}>{t.common.readMore} <Icon name="arrow" size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
