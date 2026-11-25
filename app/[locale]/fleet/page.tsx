import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { phases } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { SeatMap } from "@/components/SeatMap";
import { SpecSheet } from "@/components/SpecSheet";
import { Icon, type IconName } from "@/components/Icon";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/fleet", { page: "fleet" }) : {};
}

const whyIcons: IconName[] = ["leaf", "pin", "seat", "shield"];

export default async function Fleet({ params }: PageProps) {
  const { t } = await resolve(params);
  const f = t.fleet;
  return (
    <>
      <PageHero kicker={f.kicker} title={f.title} lead={f.lead} image="fleet" />

      <SpecSheet title={f.specsTitle} labels={f.specs} sheet={f.sheet} fine={f.fine} />

      <section className="section bg-ivory" aria-labelledby="seat-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <span className="kicker">{f.seat.kicker}</span>
            <h2 id="seat-title" className="h2">{f.seat.title}</h2>
            <p className="lead">{f.seat.lead}</p>
          </div>
          <div className="reveal">
            <SeatMap labels={{ window: f.seat.window, aisle: f.seat.aisle, row: f.seat.row, front: f.seat.front, pick: f.seat.pick }} />
          </div>
          <p className="fine" style={{ marginTop: 24 }}>{f.seat.note}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <span className="kicker">{f.kicker}</span>
            <h2 className="h2">{f.whyTitle}</h2>
          </div>
          <div className="grid g4">
            {f.why.map(([title, body], i) => (
              <div key={title} className="card reveal">
                <div className="icon-badge"><Icon name={whyIcons[i]} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy" style={{ position: "relative", overflow: "hidden" }}>
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <h2 className="h2">{f.phasesTitle}</h2>
          </div>
          <div className="grid g3">
            {phases.map((p) => {
              const [title, body] = f.phases[p.key];
              return (
                <div key={p.key} className="card-line reveal">
                  <b className="display tnum" data-count="" style={{ fontSize: "clamp(56px, 7vw, 96px)", color: "var(--gold)", lineHeight: 1, display: "block" }}>{p.aircraft}</b>
                  <span className="fine" style={{ display: "block", marginTop: 6 }}>{f.aircraft}</span>
                  <h3 style={{ marginTop: 18 }}>{title}</h3>
                  <p>{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
