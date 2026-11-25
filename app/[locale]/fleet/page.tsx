import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { phases } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { SeatMap } from "@/components/SeatMap";
import { SpecSheet } from "@/components/SpecSheet";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/fleet", { page: "fleet" }) : {};
}

const whyFigures = ["40%", "1,300 m", "2–2", "200+"];

/** A six-blade propeller that turns once and settles as the section comes in. */
function Propeller() {
  return (
    <div className="prop" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <linearGradient id="blade" x1="0" y1="100" x2="0" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--navy)" />
            <stop offset="0.86" stopColor="var(--navy)" />
            <stop offset="0.87" stopColor="var(--saffron)" />
          </linearGradient>
        </defs>
        <circle className="prop-disc" cx="100" cy="100" r="94" />
        <circle className="prop-disc" cx="100" cy="100" r="64" />
        <g className="prop-rotor">
          {[0, 60, 120, 180, 240, 300].map((r) => (
            <path key={r} transform={`rotate(${r} 100 100)`} fill="url(#blade)" d="M100 100C92 78 92 40 97 10c1-3 5-3 6 0 4 28 2 66-3 90Z" />
          ))}
          <circle cx="100" cy="100" r="17" fill="var(--paper)" stroke="var(--navy)" strokeWidth="2" />
          <circle cx="100" cy="100" r="6" fill="var(--saffron)" />
        </g>
      </svg>
    </div>
  );
}

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

      <section className="section why2" aria-labelledby="why-title">
        <div className="wrap why2-grid">
          <div className="why2-side reveal">
            <span className="kicker">{f.kicker}</span>
            <h2 id="why-title" className="h2">{f.whyTitle}</h2>
            <Propeller />
          </div>
          <ol className="why2-list">
            {f.why.map(([title, body], i) => (
              <li key={title} className="reveal" style={{ ["--i" as string]: i }}>
                <span className="why2-fig tnum">{whyFigures[i]}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-ivory grow-sec" aria-labelledby="grow-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 56 }}>
            <span className="kicker">ATR 72-600</span>
            <h2 id="grow-title" className="h2">{f.phasesTitle}</h2>
          </div>
          <ol className="grow reveal">
            {phases.map((p, i) => {
              const [title, body] = f.phases[p.key];
              const [phase, years] = title.includes(" · ") ? title.split(" · ") : ["", title];
              const count = parseInt(p.aircraft, 10);
              const more = p.aircraft.endsWith("+");
              return (
                <li key={p.key} style={{ ["--i" as string]: i }}>
                  <div className="grow-count">
                    <b className="tnum">{p.aircraft}</b>
                    <span>{f.aircraft}</span>
                  </div>
                  <div className="grow-planes" aria-hidden="true">
                    {Array.from({ length: count + (more ? 1 : 0) }, (_, k) => (
                      <svg key={k} viewBox="0 0 40 40" className={k >= count ? "ghost" : ""} style={{ ["--k" as string]: k }}>
                        <path d="M20 2c1.5 0 2.3 1.8 2.3 4.2V15l6-.1V12h2.6v2.9l7.1.1v4l-15.7 1.6v9.6l5 1.6v3l-7.3-.8-7.3.8v-3l5-1.6v-9.6L2 19v-4l7.1-.1V12h2.6v2.9l6 .1V6.2C17.7 3.8 18.5 2 20 2Z" />
                      </svg>
                    ))}
                  </div>
                  <span className="grow-tick" aria-hidden="true" />
                  {phase && <span className="grow-phase">{phase}</span>}
                  <h3>{years}</h3>
                  <p>{body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
