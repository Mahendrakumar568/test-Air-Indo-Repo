import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { phases } from "@/lib/data";
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

      <section className="section">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <h2 className="h2">{v.thesisTitle}</h2>
          </div>
          <div className="grid g2">
            {v.thesis.map(([title, body], i) => (
              <div key={title} className="card-line reveal">
                <div className="icon-badge"><Icon name={thesisIcons[i]} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 40 }}>
            <h2 className="h2">{v.planTitle}</h2>
          </div>
          <div className="grid g3">
            {phases.map((p) => {
              const [title, body] = t.fleet.phases[p.key];
              return (
                <div key={p.key} className="card reveal">
                  <b className="display tnum" style={{ fontSize: 56, lineHeight: 1 }}>{p.aircraft}</b>
                  <span className="fine" style={{ display: "block", marginTop: 6 }}>ATR 72-600 · {t.fleet.aircraft}</span>
                  <h3 style={{ marginTop: 18 }}>{title}</h3>
                  <p>{body}</p>
                </div>
              );
            })}
          </div>
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
          <div className="sticky-col">
            <h2 className="h2">{v.principlesTitle}</h2>
            <div className="stack" style={{ marginTop: 32, ["--gap" as string]: "28px" }}>
              {v.principles.map(([title, body]) => (
                <div key={title} className="card-line saffron">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
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
