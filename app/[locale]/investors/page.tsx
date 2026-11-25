import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { FleetGrowth } from "@/components/FleetGrowth";
import { PageHero } from "@/components/PageHero";
import { Icon, type IconName } from "@/components/Icon";
import { Timeline } from "@/components/Timeline";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/investors", { page: "investors" }) : {};
}

const thesisIcons: IconName[] = ["people", "chart", "plane", "pin"];

export default async function Investors({ params }: PageProps) {
  const { locale, t } = await resolve(params);
  const v = t.investors;
  return (
    <>
      <PageHero kicker={v.kicker} title={v.title} lead={v.lead} image="investors" facts={t.home.stats.slice(0, 3) as [string, string][]}>
        <div className="btn-row" style={{ marginTop: 32 }}>
          <a href="#deck" className="btn btn-primary">{v.deckTitle}</a>
        </div>
      </PageHero>

      <section className="section opp" aria-labelledby="opp-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 56 }}>
            <span className="kicker">{v.kicker}</span>
            <h2 id="opp-title" className="h2">{v.thesisTitle}</h2>
          </div>
          <div className="opp-quad reveal">
            <span className="opp-axis x" aria-hidden="true" />
            <span className="opp-axis y" aria-hidden="true" />
            <span className="opp-core" aria-hidden="true"><img src="/brand/air-indo-symbol-colour.svg" alt="" width={56} height={56} /></span>
            {v.thesis.map(([title, body], i) => (
              <div key={title} className="opp-cell" style={{ ["--i" as string]: i }}>
                <span className="opp-n tnum" aria-hidden="true">0{i + 1}</span>
                <span className="opp-icon"><Icon name={thesisIcons[i]} /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory grow-sec" aria-labelledby="plan-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 56 }}>
            <span className="kicker">ATR 72-600</span>
            <h2 id="plan-title" className="h2">{v.planTitle}</h2>
          </div>
          <FleetGrowth phases={t.fleet.phases} aircraft={t.fleet.aircraft} />
        </div>
      </section>

      <section className="section bg-navy-3">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <span className="kicker">{t.home.journeyKicker}</span>
            <h2 className="h2">{t.home.journeyTitle}</h2>
          </div>
          <Timeline t={t} />
        </div>
      </section>

      <section className="section">
        <div className="wrap split split-top">
          <div className="build-col reveal">
            <h2 className="h2">{v.principlesTitle}</h2>
            <ol className="build-list">
              {v.principles.map(([title, body], i) => (
                <li key={title} style={{ ["--i" as string]: i }}>
                  <span className="build-n tnum">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="snapshot">
              <div className="snapshot-bar"><span>AIR INDO</span><span>{v.kicker}</span></div>
              <dl>
                {t.home.stats.map(([n, l]) => (
                  <div key={l}><dt className="tnum">{n}</dt><dd>{l}</dd></div>
                ))}
              </dl>
            </div>
          </div>
          <div className="form-panel" id="deck">
            <h2 className="h3">{v.deckTitle}</h2>
            <p className="body" style={{ margin: "8px 0 24px" }}>{v.deckLead}</p>
            <ContactForm locale={locale} t={t.forms} defaultTopic="investor" idPrefix="iv" />
          </div>
        </div>
        <div className="wrap">
          <p className="fine" style={{ marginTop: 48, maxWidth: 820 }}>{v.disclaimer}</p>
        </div>
      </section>
    </>
  );
}
