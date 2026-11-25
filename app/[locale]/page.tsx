import Link from "next/link";
import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { cityList, fleetSpecs } from "@/lib/data";
import { Img } from "@/components/Img";
import { Icon, type IconName } from "@/components/Icon";
import { CinematicNetwork } from "@/components/CinematicNetwork";
import { RouteExplorer } from "@/components/RouteExplorer";
import { DestinationRail } from "@/components/DestinationRail";
import { SectionIndex } from "@/components/SectionIndex";
import { Timeline } from "@/components/Timeline";
import { FlightLines } from "@/components/FlightLines";
import { keep } from "@/lib/keep";
import { WaitlistForm } from "@/components/forms/WaitlistForm";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "") : {};
}

const whyIcons: IconName[] = ["fare", "shield", "route", "heart"];

export default async function Home({ params }: PageProps) {
  const { locale, t, names } = await resolve(params);
  const h = t.home;
  const L = (p: string) => `/${locale}${p}`;

  const index = [
    { id: "top", label: h.kicker },
    { id: "network", label: h.networkKicker },
    { id: "destinations", label: t.routes.destinationsTitle },
    { id: "story", label: t.about.kicker },
    { id: "fleet", label: h.fleetKicker },
    { id: "why", label: h.whyKicker },
    { id: "progress", label: h.journeyKicker },
    { id: "waitlist", label: t.nav.joinWaitlist },
  ];

  return (
    <>
      <SectionIndex items={index} label={t.common.onThisPage} />
      {/* Hero */}
      <section id="top" data-tone="dark" className="hero hero-grand">
        <div className="hero-media kb">
          <Img slot="hero" priority sizes="100vw" />
        </div>
        <div className="wrap hero-inner">
          <p className="hello">{t.common.welcome}</p>
          <span className="kicker">{h.kicker}</span>
          <h1 className="h1 display-xl">
            {h.title[0]} <span className="accent">{h.title[1]}</span>
          </h1>
          <p className="lead">{h.lead}</p>
          <div className="btn-row">
            <a href="#waitlist" className="btn btn-primary btn-lg">{h.ctaPrimary} <Icon name="arrow" size={18} /></a>
            <Link href={L("/routes")} className="btn btn-glass btn-lg">{h.ctaSecondary}</Link>
          </div>
        </div>
        <div className="hero-bar">
          <dl className="wrap hero-stats">
            {h.stats.map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd><b className="tnum" data-count="">{n}</b><span>{label}</span></dd>
              </div>
            ))}
          </dl>
        </div>
        <span className="scroll-cue" aria-hidden="true"><i /></span>
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
      <section id="destinations" className="dest-section" aria-labelledby="dest-title">
        <DestinationRail
          head={
            <div className="wrap">
              <div className="head-row">
                <div className="head">
                  <span className="kicker">{t.routes.destinationsTitle}</span>
                  <h2 id="dest-title" className="h2">{t.routes.title}</h2>
                </div>
                <Link href={L("/routes")} className="link-arrow">{t.common.allRoutes} <Icon name="arrow" size={18} /></Link>
              </div>
            </div>
          }
          items={cityList.map((c) => ({
            code: c.code,
            href: L(`/routes/${c.slug}`),
            name: names[c.code],
            tagline: t.cities[c.code].tagline,
            state: t.cities[c.code].state,
          }))}
        />
      </section>

      {/* Manifesto */}
      <section id="story" className="manifesto story2" aria-labelledby="manifesto-title">
        <div className="wrap story2-grid">
          <div className="story2-copy reveal">
            <span className="kicker">{t.about.kicker}</span>
            <blockquote>
              <p id="manifesto-title" className="manifesto-quote">&ldquo;{t.about.founderQuote}&rdquo;</p>
              <footer>
                <img src="/brand/air-indo-symbol-colour.svg" alt="" width={40} height={40} loading="lazy" />
                <span><b>{t.about.founderName}</b>{t.about.founderRole}</span>
              </footer>
            </blockquote>
            <Link href={L("/about")} className="btn btn-navy story2-cta">{t.common.readMore} <Icon name="arrow" size={18} /></Link>
          </div>
          <figure className="story2-arch reveal" aria-hidden="true">
            <span className="story2-sun" />
            <span className="story2-frame"><Img slot="heritage" sizes="(max-width: 900px) 80vw, 34vw" alt="" /></span>
            <span className="story2-badge">{t.about.values[2][0]}</span>
          </figure>
        </div>
        <ol className="wrap story2-values">
          {t.about.values.slice(0, 3).map(([title, text], i) => (
            <li key={title} className="reveal">
              <span className="sv-n">0{i + 1}</span>
              <b>{title}</b>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Fleet */}
      <section id="fleet" data-tone="dark" className="cinema" aria-labelledby="fleet-title">
        <div className="cinema-media kb-scroll"><Img slot="fleet" sizes="100vw" /></div>
        <div className="wrap cinema-copy on-dark">
          <div className="reveal">
            <span className="kicker">{h.fleetKicker}</span>
            <h2 id="fleet-title" className="h2 display-lg">{keep(h.fleetTitle)}</h2>
            <p className="lead">{h.fleetLead}</p>
          </div>
          <dl className="cinema-specs reveal">
            {fleetSpecs.slice(0, 3).map((s) => (
              <div key={s.key}>
                <dt>{t.fleet.specs[s.key as keyof typeof t.fleet.specs]}</dt>
                <dd data-count="">{s.value}</dd>
              </div>
            ))}
            <div className="cinema-link">
              <Link href={L("/fleet")} className="link-arrow">{t.common.learnMore} <Icon name="arrow" size={18} /></Link>
            </div>
          </dl>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="section" aria-labelledby="why-title">
        <div className="wrap why-split">
          <div className="why-aside">
            <div className="head reveal">
              <span className="kicker">{h.whyKicker}</span>
              <h2 id="why-title" className="h2">{h.whyTitle}</h2>
            </div>
            <div className="media r-4-5 reveal why-photo"><Img slot="boarding" sizes="(max-width: 960px) 100vw, 480px" /></div>
          </div>
          <ol className="num-list">
            {h.why.map(([title, body], i) => (
              <li key={title} className="reveal">
                <span className="num-big">0{i + 1}</span>
                <div>
                  <h3><span className="ico"><Icon name={whyIcons[i]} size={22} /></span>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Progress */}
      <section id="progress" data-tone="dark" className="section bg-navy-3" aria-labelledby="progress-title" style={{ position: "relative", overflow: "hidden", isolation: "isolate" }}>
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

      {/* Waitlist */}
      <section id="waitlist" data-tone="dark" className="section closing on-dark" aria-labelledby="wl-title">
        <div className="closing-media" aria-hidden="true"><Img slot="arrival" alt="" sizes="100vw" /></div>
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
