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
        </div>
      </section>

      <section className="section">
        <div className="wrap split split-top">
          <div>
            <p className="lead" style={{ color: "var(--ink)" }}>{ct.about}</p>
            <dl className="facts" style={{ marginTop: 36 }}>
              <div><dt>{t.routes.airport}</dt><dd>{ct.airport} ({c.code})</dd></div>
              <div><dt>{t.routes.corridorLabel}</dt><dd>{corrs.map((id) => t.corridors[id][0]).join(" / ")}</dd></div>
            </dl>
            <h2 className="h3" style={{ marginTop: 48 }}>{t.routes.highlights}</h2>
            <ul style={{ listStyle: "none", marginTop: 16 }} className="stack">
              {ct.highlights.map((hl) => (
                <li key={hl} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ color: "var(--saffron)" }}><Icon name="pin" size={20} /></span> {hl}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h3">{t.routes.connections}</h2>
            <div className="stack" style={{ marginTop: 18, ["--gap" as string]: "12px" }}>
              {conns.map((to) => {
                const km = distanceKm(c.code, to);
                return (
                  <Link key={to} href={`/${locale}/routes/${cities[to].slug}`} className="corridor" style={{ textDecoration: "none" }}>
                    <span className="label">{t.routes.nonstop} · {t.common.proposed}</span>
                    <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {names[c.code]} <Icon name="arrow" size={18} /> {names[to]}
                    </h3>
                    <span className="legs">
                      <span className="leg-pill">{c.code}–{to}</span>
                      <span className="leg-pill">{km.toLocaleString("en-IN")} {t.common.km}</span>
                      <span className="leg-pill">~{fmtTime(blockMinutes(km), t.common.hours, t.common.minutes)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="form-panel" style={{ marginTop: 32 }}>
              <h2 className="h3">{t.routes.notifyTitle}</h2>
              <p className="body" style={{ margin: "8px 0 22px" }}>{t.routes.notifyLead}</p>
              <WaitlistForm locale={locale} t={t.forms} names={names} defaultFrom={c.code} source={`city-${c.code}`} idPrefix="cw" />
            </div>
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
