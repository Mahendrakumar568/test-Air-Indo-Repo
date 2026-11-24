import Link from "next/link";
import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { cityList, connectionsOf } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Img } from "@/components/Img";
import { RouteNetwork } from "@/components/RouteNetwork";
import { RouteExplorer } from "@/components/RouteExplorer";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/routes", { page: "routes", og: "routes" }) : {};
}

export default async function Routes({ params }: PageProps) {
  const { locale, t, names } = await resolve(params);
  const r = t.routes;
  return (
    <>
      <PageHero kicker={r.kicker} title={r.title} lead={r.lead} image="heroAlt" />
      <section className="section bg-white">
        <div className="wrap">
          <RouteNetwork
            locale={locale}
            names={names}
            corridorText={t.corridors}
            linkCities={false}
            labels={{ corridor: r.corridorLabel, proposed: t.common.proposed, km: t.common.km, h: t.common.hours, min: t.common.minutes }}
          />
        </div>
      </section>
      <section className="section bg-ivory">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <span className="kicker">{r.destinationsTitle}</span>
            <h2 className="h2">{t.home.networkTitle}</h2>
          </div>
          <div className="grid g3">
            {cityList.map((c) => (
              <Link key={c.code} href={`/${locale}/routes/${c.slug}`} className="dest-card reveal">
                <div className="media"><Img slot={c.code} sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px" /></div>
                <div className="meta">
                  <h3>{names[c.code]}</h3>
                  <span className="code">{c.code}</span>
                </div>
                <p>{t.cities[c.code].state} · {r.nonstop}: {connectionsOf(c.code).map((x) => names[x]).join(", ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <div className="head">
            <span className="kicker">{r.notifyTitle}</span>
            <h2 className="h2">{t.home.closingTitle}</h2>
            <p className="lead">{r.notifyLead}</p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Link href={`/${locale}#waitlist`} className="btn btn-primary">{t.nav.joinWaitlist}</Link>
            </div>
          </div>
          <RouteExplorer
            names={names}
            t={t.home.explorer}
            labels={{
              from: t.forms.waitlist.from, to: t.forms.waitlist.to, distance: t.common.distance, estimated: t.common.estimated,
              status: t.common.status, proposed: t.common.proposed, km: t.common.km, h: t.common.hours, min: t.common.minutes,
            }}
          />
        </div>
      </section>
    </>
  );
}
