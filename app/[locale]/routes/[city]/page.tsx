import Link from "next/link";
import { notFound } from "next/navigation";
import { resolve } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale, locales } from "@/lib/i18n";
import { getDict } from "@/lib/dict";
import { cityBySlug, cityList, connectionsOf, distanceKm, blockMinutes, corridorsOfCity, cities } from "@/lib/data";
import { fmtTime } from "@/lib/format";
import { Img } from "@/components/Img";
import { Icon } from "@/components/Icon";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { CityMap } from "@/components/CityMap";

type Props = { params: Promise<{ locale: string; city: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => cityList.map((c) => ({ locale, city: c.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, city } = await params;
  const c = cityBySlug(city);
  if (!isLocale(locale) || !c) return {};
  const t = getDict(locale);
  const ct = t.cities[c.code];
  return pageMeta(locale, `/routes/${c.slug}`, { title: `${ct.name} (${c.code})`, description: `${ct.tagline} ${ct.about}`.slice(0, 300), og: "routes" });
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const { locale, t, names } = await resolve(params);
  const c = cityBySlug(city);
  if (!c) notFound();
  const ct = t.cities[c.code];
  const conns = connectionsOf(c.code);
  const corrs = corridorsOfCity(c.code);
  const shortest = Math.min(...conns.map((to) => blockMinutes(distanceKm(c.code, to))));
  const q = t.routes.quick;

  return (
    <>
      <section className="page-hero with-image" style={{ minHeight: "min(72vh, 640px)", display: "flex", alignItems: "flex-end" }}>
        <div className="hero-media"><Img slot={c.code} priority sizes="100vw" /></div>
        <div className="wrap" style={{ width: "100%" }}>
          <nav aria-label="Breadcrumb" className="fine" style={{ color: "#c9cee6", marginBottom: 18 }}>
            <Link href={`/${locale}/routes`} style={{ color: "var(--gold)" }}>{t.common.allRoutes}</Link> / {ct.name}
          </nav>
          <span className="kicker">{ct.state} · {c.code}</span>
          <h1 className="h1">{ct.name}</h1>
          <p className="lead">{ct.tagline}</p>
          <dl className="hero-facts">
            <div><dt>{q.airport}</dt><dd>{c.code}</dd></div>
            <div><dt>{q.links}</dt><dd data-count="">{conns.length}</dd></div>
            <div><dt>{q.shortest}</dt><dd>~{fmtTime(shortest, t.common.hours, t.common.minutes)}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap split split-top">
          <div className="reveal">
            <span className="kicker">{ct.state}</span>
            <p className="story-lead" style={{ marginTop: 18 }}>{ct.about}</p>
            <h2 className="h3" style={{ marginTop: 44 }}>{t.routes.highlights}</h2>
            <ul className="hl-list">
              {ct.highlights.map((hl, i) => (
                <li key={hl}><span className="hl-n">0{i + 1}</span>{hl}</li>
              ))}
            </ul>
            <dl className="facts" style={{ marginTop: 40 }}>
              <div><dt>{t.routes.airport}</dt><dd>{ct.airport} ({c.code})</dd></div>
              <div><dt>{t.routes.corridorLabel}</dt><dd>{corrs.map((id) => t.corridors[id][0]).join(" / ")}</dd></div>
            </dl>
          </div>
          <div className="reveal">
            <div className="map-panel">
              <CityMap code={c.code} names={names} label={`${t.routes.connections}: ${conns.map((x) => names[x]).join(", ")}`} />
              <h2 className="h3">{t.routes.connections}</h2>
              <ul className="conn-list">
                {conns.map((to) => {
                  const km = distanceKm(c.code, to);
                  return (
                    <li key={to}>
                      <Link href={`/${locale}/routes/${cities[to].slug}`} className="conn">
                        <span className="conn-route"><b>{c.code}</b><i /><b>{to}</b></span>
                        <span className="conn-name">{names[to]}</span>
                        <span className="conn-meta tnum">{km.toLocaleString("en-IN")} {t.common.km} · ~{fmtTime(blockMinutes(km), t.common.hours, t.common.minutes)}</span>
                        <Icon name="arrow" size={18} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-ivory">
        <div className="wrap split split-top">
          <div className="head reveal sticky-col">
            <span className="kicker">{t.forms.waitlist.title}</span>
            <h2 className="h2">{t.routes.notifyTitle}</h2>
            <p className="lead">{t.routes.notifyLead}</p>
          </div>
          <div className="form-panel">
            <WaitlistForm locale={locale} t={t.forms} names={names} defaultFrom={c.code} source={`city-${c.code}`} idPrefix="cw" />
          </div>
        </div>
      </section>

      {(() => {
        const i = cityList.findIndex((x) => x.code === c.code);
        const n = cityList[(i + 1) % cityList.length];
        return (
          <Link href={`/${locale}/routes/${n.slug}`} className="next-band">
            <span className="next-media"><Img slot={n.code} sizes="100vw" alt="" /></span>
            <span className="wrap next-copy">
              <span className="kicker">{t.common.nextDestination}</span>
              <span className="next-name">{names[n.code]}</span>
              <span className="next-tag">{t.cities[n.code].tagline}</span>
            </span>
            <span className="next-go" aria-hidden="true"><Icon name="arrow" size={26} /></span>
          </Link>
        );
      })()}
      <div className="wrap" style={{ paddingBlock: 28 }}>
        <p className="fine">{t.common.notice}</p>
      </div>
    </>
  );
}
