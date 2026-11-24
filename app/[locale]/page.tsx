import Link from "next/link";
import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { cityList } from "@/lib/data";
import { Img } from "@/components/Img";
import { Icon, type IconName } from "@/components/Icon";
import { CinematicNetwork } from "@/components/CinematicNetwork";
import { RouteExplorer } from "@/components/RouteExplorer";
import { Timeline } from "@/components/Timeline";
import { FlightLines } from "@/components/FlightLines";
import { WaitlistForm } from "@/components/forms/WaitlistForm";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "") : {};
}

const whyIcons: IconName[] = ["fare", "shield", "route", "heart"];
const audienceLinks = ["/investors#deck", "/contact?topic=partnership", "/careers", "/newsroom"];

export default async function Home({ params }: PageProps) {
  const { locale, t, names } = await resolve(params);
  const h = t.home;
  const L = (p: string) => `/${locale}${p}`;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-media">
          <Img slot="hero" priority sizes="100vw" />
        </div>
        <div className="wrap hero-inner">
          <p className="hello" lang="te">{t.common.welcome}</p>
          <span className="kicker" style={{ color: "var(--gold)" }}>{h.kicker}</span>
          <h1 className="h1" style={{ marginTop: 16 }}>
            {h.title[0]} <span className="accent">{h.title[1]}</span>
          </h1>
          <p className="lead">{h.lead}</p>
          <div className="btn-row">
            <a href="#waitlist" className="btn btn-primary">{h.ctaPrimary}</a>
            <Link href={L("/routes")} className="btn btn-ghost-light">{h.ctaSecondary}</Link>
          </div>
          <dl className="hero-stats">
            {h.stats.map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd><b className="tnum">{n}</b><span>{label}</span></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Network */}
      <CinematicNetwork
        locale={locale}
        names={names}
        corridorText={t.corridors}
        intro={{ kicker: h.networkKicker, title: h.networkTitle, lead: h.networkLead, id: "network-title" }}
        labels={{ corridor: t.routes.corridorLabel, proposed: t.common.proposed, km: t.common.km, h: t.common.hours, min: t.common.minutes, ...t.routes.cine }}
      />

      {/* Destinations */}
      <section className="section-sm bg-ivory" aria-labelledby="dest-title">
        <div className="wrap">
          <div className="head-row reveal">
            <div className="head">
              <span className="kicker">{t.routes.destinationsTitle}</span>
              <h2 id="dest-title" className="h2" style={{ marginTop: 12 }}>{t.routes.title}</h2>
            </div>
            <Link href={L("/routes")} className="link-arrow">{t.common.allRoutes} <Icon name="arrow" size={18} /></Link>
          </div>
          <div className="grid g3">
            {cityList.map((c) => (
              <Link key={c.code} href={L(`/routes/${c.slug}`)} className="dest-card reveal">
                <div className="media"><Img slot={c.code} sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px" /></div>
                <div className="meta">
                  <h3>{names[c.code]}</h3>
                  <span className="code">{c.code}</span>
                </div>
                <p>{t.cities[c.code].tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section" aria-labelledby="why-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 56 }}>
            <span className="kicker">{h.whyKicker}</span>
            <h2 id="why-title" className="h2">{h.whyTitle}</h2>
          </div>
          <div className="grid g4">
            {h.why.map(([title, body], i) => (
              <div key={title} className="card-line reveal">
                <div className="icon-badge"><Icon name={whyIcons[i]} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="feature-band bg-navy" aria-labelledby="fleet-title">
        <div className="media"><Img slot="fleet" sizes="(max-width: 900px) 100vw, 50vw" /></div>
        <div className="feature-copy on-dark">
          <span className="kicker">{h.fleetKicker}</span>
          <h2 id="fleet-title" className="h2" style={{ marginTop: 14 }}>{h.fleetTitle}</h2>
          <p className="lead" style={{ marginTop: 20 }}>{h.fleetLead}</p>
          <div style={{ marginTop: 32 }}>
            <Link href={L("/fleet")} className="link-arrow">{t.common.learnMore} <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="feature-band reverse" aria-labelledby="exp-title">
        <div className="media"><Img slot="meal" sizes="(max-width: 900px) 100vw, 50vw" /></div>
        <div className="feature-copy bg-ivory">
          <span className="kicker">{h.experienceKicker}</span>
          <h2 id="exp-title" className="h2" style={{ marginTop: 14 }}>{h.experienceTitle}</h2>
          <p className="lead" style={{ marginTop: 20 }}>{h.experienceLead}</p>
          <div style={{ marginTop: 32 }}>
            <Link href={L("/experience")} className="link-arrow">{t.common.learnMore} <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Cargo */}
      <section className="section-sm bg-white border-y" aria-labelledby="cargo-title">
        <div className="wrap split">
          <div className="reveal">
            <span className="kicker">{h.cargoKicker}</span>
            <h2 id="cargo-title" className="h2" style={{ marginTop: 14 }}>{h.cargoTitle}</h2>
            <p className="lead" style={{ marginTop: 20 }}>{h.cargoLead}</p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Link href={L("/cargo")} className="btn btn-ghost">{t.common.learnMore}</Link>
            </div>
          </div>
          <div className="media r-3-2 reveal"><Img slot="cargo" sizes="(max-width: 960px) 100vw, 560px" /></div>
        </div>
      </section>

      {/* Progress */}
      <section id="progress" className="section bg-navy-3" aria-labelledby="progress-title" style={{ position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <FlightLines className="flight-lines" />
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 56 }}>
            <span className="kicker">{h.journeyKicker}</span>
            <h2 id="progress-title" className="h2">{h.journeyTitle}</h2>
            <p className="lead">{h.journeyLead}</p>
          </div>
          <div className="reveal"><Timeline t={t} /></div>
        </div>
      </section>

      {/* Audiences */}
      <section className="section" aria-labelledby="aud-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <span className="kicker">{h.audienceKicker}</span>
            <h2 id="aud-title" className="h2">{h.audienceTitle}</h2>
          </div>
          <div className="grid g4">
            {h.audiences.map(([title, body, cta], i) => (
              <div key={title} className="card reveal" style={{ display: "flex", flexDirection: "column" }}>
                <span className="num">0{i + 1}</span>
                <h3 style={{ marginTop: 12 }}>{title}</h3>
                <p style={{ flex: 1 }}>{body}</p>
                <Link href={L(audienceLinks[i])} className="link-arrow" style={{ marginTop: 20, alignSelf: "flex-start" }}>
                  {cta} <Icon name="arrow" size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="section bg-ivory feather-field feather-light" aria-labelledby="wl-title">
        <div className="wrap split split-top">
          <div className="stack" style={{ ["--gap" as string]: "24px" }}>
            <span className="kicker">{t.forms.waitlist.title}</span>
            <h2 id="wl-title" className="h2">{h.closingTitle}</h2>
            <p className="lead">{h.closingLead}</p>
            <RouteExplorer
              names={names}
              t={h.explorer}
              labels={{
                from: t.forms.waitlist.from, to: t.forms.waitlist.to, distance: t.common.distance, estimated: t.common.estimated,
                status: t.common.status, proposed: t.common.proposed, km: t.common.km, h: t.common.hours, min: t.common.minutes,
              }}
            />
          </div>
          <div className="form-panel">
            <h3 className="h3">{t.forms.waitlist.title}</h3>
            <p className="body" style={{ margin: "8px 0 24px" }}>{t.forms.waitlist.lead}</p>
            <WaitlistForm locale={locale} t={t.forms} names={names} source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
