import Link from "next/link";
import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { newsPosts } from "@/lib/data";
import { company } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { NewsGrid } from "@/components/NewsGrid";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/newsroom", { page: "newsroom" }) : {};
}

export default async function Newsroom({ params }: PageProps) {
  const { locale, t } = await resolve(params);
  const n = t.newsroom;
  return (
    <>
      <PageHero kicker={n.kicker} title={n.title} lead={n.lead} />
      <section className="section">
        <div className="wrap">
          <NewsGrid
            href={`/${locale}/newsroom`}
            all={t.common.all}
            tags={n.tags}
            posts={newsPosts.map((p) => ({ slug: p.slug, tag: p.tag, image: p.image, title: n.posts[p.slug].title, excerpt: n.posts[p.slug].excerpt }))}
          />
        </div>
      </section>
      <section className="section bg-ivory" id="press">
        <div className="wrap split split-top">
          <div>
            <h2 className="h2">{n.pressTitle}</h2>
            <p className="lead">{n.pressLead}</p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <a className="btn btn-navy" href="/brand/air-indo-logo-package.zip" download>
                <Icon name="download" size={20} /> {n.pressKit}
              </a>
              <Link className="btn btn-ghost" href={`/${locale}/contact?topic=media`}>{n.mediaContact}</Link>
            </div>
            {company.mediaEmail && <p className="body" style={{ marginTop: 18 }}>{company.mediaEmail}</p>}
          </div>
          <div className="card">
            <h3>{n.factsTitle}</h3>
            <dl className="facts" style={{ marginTop: 16 }}>
              {n.facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
