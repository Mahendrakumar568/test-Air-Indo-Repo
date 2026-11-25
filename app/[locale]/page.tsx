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
const audienceLinks = ["/investors#deck", "/contact?topic=partnership", "/careers", "/newsroom"];

export default async function Home({ params }: PageProps) {
  const { locale, t, names } = await resolve(params);
  const h = t.home;
  const L = (p: string) => `/${locale}${p}`;

  const index = [
    { id: "top", label: h.kicker },
    { id: "network", label: h.networkKicker },
    { id: "story", label: t.about.kicker },
    { id: "destinations", label: t.routes.destinationsTitle },
    { id: "fleet", label: h.fleetKicker },
    { id: "why", label: h.whyKicker },
    { id: "onboard", label: h.experienceKicker },
    { id: "cargo", label: t.nav.cargo },
    { id: "progress", label: h.journeyKicker },
    { id: "work-with-us", label: h.audienceKicker },
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
          <p className="hello" lang="te">{t.common.welcome}</p>
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

      {/* Manifesto */}
      <section id="story" className="manifesto" aria-labelledby="manifesto-title">
        <div className="wrap center reveal">
          <img className="manifesto-mark" src="/brand/air-indo-symbol-colour.svg" alt="" width={72} height={72} loading="lazy" />
          <span className="kicker">{t.about.kicker}</span>
          <blockquote>
            <p id="manifesto-title" className="manifesto-quote">&ldquo;{t.about.founderQuote}&rdquo;</p>
            <footer>
              <b>{t.about.founderName}</b> · {t.about.founderRole}
            </footer>
          </blockquote>
          <ul className="manifesto-values">
            {t.about.values.slice(0, 3).map(([title]) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
          <Link href={L("/about")} className="link-arrow" style={{ marginTop: 40 }}>{t.common.readMore} <Icon name="arrow" size={18} /></Link>
        </div>
      </section>

      {/* City ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {cityList.map((c) => (
                <span key={c.code} className="tk">{names[c.code]}<i>{c.code}</i></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <section id="destinations" className="section dest-section" aria-labelledby="dest-title">
        <div className="wrap">
          <div className="head-row reveal">
            <div className="head">
              <span className="kicker">{t.routes.destinationsTitle}</span>
              <h2 id="dest-title" className="h2">{t.routes.title}</h2>
            </div>
            <Link href={L("/routes")} className="link-arrow">{t.common.allRoutes} <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
        <div className="reveal">
          <DestinationRail
            prev={t.common.prev}
            next={t.common.next}
            items={cityList.map((c) => ({
              code: c.code,
              href: L(`/routes/${c.slug}`),
              name: names[c.code],
              tagline: t.cities[c.code].tagline,
              state: t.cities[c.code].state,
            }))}
          />
        </div>
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

      {/* Experience */}
      <section id="onboard" className="section bg-ivory experience-band" aria-labelledby="exp-title">
        <div className="wrap">
          <div className="head-row reveal">
            <div className="head">
              <span className="kicker">{h.experienceKicker}</span>
              <h2 id="exp-title" className="h2">{h.experienceTitle}</h2>
              <p className="lead">{h.experienceLead}</p>
            </div>
            <Link href={L("/experience")} className="link-arrow">{t.common.learnMore} <Icon name="arrow" size={18} /></Link>
          </div>
          <div className="mosaic">
            <div className="media m-a reveal"><Img slot="cabin" sizes="(max-width: 960px) 100vw, 720px" /></div>
            <div className="media m-b reveal"><Img slot="meal" sizes="(max-width: 960px) 100vw, 480px" /></div>
            <div className="media m-c reveal"><Img slot="crew" sizes="(max-width: 960px) 100vw, 480px" /></div>
          </div>
        </div>
      </section>

      {/* Cargo */}
      <section id="cargo" className="section cargo-band" aria-labelledby="cargo-title">
        <div className="wrap split">
          <div className="media r-4-3 reveal cargo-photo"><Img slot="cargo" sizes="(max-width: 960px) 100vw, 640px" /></div>
          <div className="reveal">
            <span className="kicker">{h.cargoKicker}</span>
            <h2 id="cargo-title" className="h2">{h.cargoTitle}</h2>
            <p className="lead">{h.cargoLead}</p>
            <div className="btn-row" style={{ marginTop: 32 }}>
              <Link href={L("/cargo")} className="btn btn-ghost">{t.common.learnMore} <Icon name="arrow" size={18} /></Link>
            </div>
          </div>
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

      {/* Audiences */}
      <section id="work-with-us" className="section" aria-labelledby="aud-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 40 }}>
            <span className="kicker">{h.audienceKicker}</span>
            <h2 id="aud-title" className="h2">{h.audienceTitle}</h2>
          </div>
          <ul className="rows">
            {h.audiences.map(([title, body, cta], i) => (
              <li key={title} className="reveal">
                <Link href={L(audienceLinks[i])} className="row-link">
                  <span className="num">0{i + 1}</span>
                  <span className="row-title">{title}</span>
                  <span className="row-body">{body}</span>
                  <span className="row-cta">{cta} <Icon name="arrow" size={18} /></span>
                </Link>
              </li>
            ))}
          </ul>
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
