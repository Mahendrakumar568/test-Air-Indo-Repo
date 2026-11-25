import Link from "next/link";
import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { cityList, connectionsOf } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import Image from "next/image";
import { images } from "@/lib/images";
import { alts } from "@/lib/alts";
import { Icon } from "@/components/Icon";
import { CinematicNetwork } from "@/components/CinematicNetwork";
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
      <CinematicNetwork
        locale={locale}
        names={names}
        corridorText={t.corridors}
        intro={{ kicker: t.home.networkKicker, title: t.home.networkTitle, lead: t.home.networkLead, id: "network-title" }}
        labels={{ corridor: r.corridorLabel, proposed: t.common.proposed, km: t.common.km, h: t.common.hours, min: t.common.minutes, ...r.cine }}
      />
      <section className="section bg-ivory">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <span className="kicker">{r.kicker}</span>
            <h2 className="h2">{r.destinationsTitle}</h2>
          </div>
          <div className="grid g3">
            {cityList.map((c, i) => (
              <Link key={c.code} href={`/${locale}/routes/${c.slug}`} className="rail-card reveal">
                <Image src={images[c.code].src} alt={alts[c.code]} fill sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px" quality={75} />
                <span className="rail-shade" />
                <span className="rail-idx">0{i + 1}</span>
                <span className="rail-meta">
                  <span className="rail-state">{t.cities[c.code].state} · {c.code}</span>
                  <span className="rail-name">{names[c.code]}</span>
                  <span className="rail-tag">{r.nonstop}: {connectionsOf(c.code).map((x) => names[x]).join(", ")}</span>
                </span>
                <span className="rail-go" aria-hidden="true"><Icon name="arrow" size={18} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <div className="head">
            <h2 className="h2">{r.notifyTitle}</h2>
            <p className="lead">{r.notifyLead}</p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Link href={`/${locale}#waitlist`} className="btn btn-primary btn-lg">{t.nav.joinWaitlist} <Icon name="arrow" size={18} /></Link>
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
