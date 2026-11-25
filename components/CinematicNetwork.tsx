"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cities, corridors, project, distanceKm, blockMinutes, type CityCode, type CorridorId } from "@/lib/data";
import { images, type ImageKey } from "@/lib/images";
import type { Locale } from "@/lib/i18n";
import { fmtTime } from "@/lib/format";

type Props = {
  locale: Locale;
  names: Record<CityCode, string>;
  corridorText: Record<CorridorId, string[]>;
  intro: { kicker: string; title: string; lead: string; id?: string };
  labels: {
    corridor: string;
    proposed: string;
    km: string;
    h: string;
    min: string;
    hint: string;
    network: string;
    total: string;
    time: string;
    explore: string;
    step: string;
  };
};

const W = 600;
const H = 520;
const codes = Object.keys(cities) as CityCode[];
/** Backdrop photo for the overview and for each corridor. */
const backdrops: ImageKey[] = ["heroAlt", "VTZ", "GOI", "PNQ"];

const curve = (a: CityCode, b: CityCode) => {
  const p = project(a);
  const q = project(b);
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  const k = 0.18;
  return `M${p.x} ${p.y} Q${mx - (q.y - p.y) * k} ${my + (q.x - p.x) * k} ${q.x} ${q.y}`;
};

const legs = corridors.flatMap((c, ci) => c.legs.map(([a, b], li) => ({ ci, li, a, b, d: curve(a, b), km: distanceKm(a, b) })));

/** Camera framing for a corridor: centre on its cities and zoom in, within limits. */
const camera = (step: number, narrow: boolean, names: Record<CityCode, string>) => {
  if (step < 1 && !narrow) return { x: 0, y: 0, s: 1 };
  const fs = narrow ? 21 : 15;
  const list = step < 1 ? codes : [...new Set(corridors[step - 1].legs.flat())];
  // Bounding box of the dots and their labels, so the zoom never crops a city name.
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  list.forEach((code) => {
    const p = project(code);
    const { dx, dy, anchor } = cities[code].label;
    const w = names[code].length * fs * 0.58;
    const lx = p.x + dx;
    x0 = Math.min(x0, p.x - 10, anchor === "end" ? lx - w : lx);
    x1 = Math.max(x1, p.x + 10, anchor === "end" ? lx : lx + w);
    y0 = Math.min(y0, p.y - 12, p.y + dy - fs);
    y1 = Math.max(y1, p.y + 12, p.y + dy + 18);
  });
  const pad = narrow ? 36 : 120;
  const min = narrow ? 0.7 : 1;
  const max = narrow ? 1.9 : 1.55;
  const s = Math.max(min, Math.min(max, W / (x1 - x0 + pad), H / (y1 - y0 + pad)));
  return { x: W / 2 - ((x0 + x1) / 2) * s, y: H / 2 - ((y0 + y1) / 2) * s, s };
};

/** Graticule lines every 2.5 degrees, projected with the same maths as the cities. */
const lon = (v: number) => ((v - 71.5) / 14.5) * 540 + 30;
const lat = (v: number) => ((25 - v) / 11.5) * 460 + 30;

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

const usePrefersReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");

function Counter({ value, format }: { value: number; run?: boolean; format: (n: number) => string }) {
  return <>{format(value)}</>;
}

const PLANE = "M9 0 L-2 -1.3 L-5 -7 L-7.2 -7 L-5.4 -1.3 L-9 -1.1 L-10.4 -3.6 L-11.8 -3.6 L-11 0 L-11.8 3.6 L-10.4 3.6 L-9 1.1 L-5.4 1.3 L-7.2 7 L-5 7 L-2 1.3 Z";

export function CinematicNetwork({ locale, names, corridorText, intro, labels }: Props) {
  const [step, setStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (i: number) =>
    stepRefs.current[i]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });

  const narrow = useMedia("(max-width: 960px)");
  const cam = camera(step, narrow, names);
  const activeCorridor = step > 0 ? step - 1 : -1;
  const activeCities = new Set(activeCorridor >= 0 ? corridors[activeCorridor].legs.flat() : codes);
  const t = (m: number) => fmtTime(m, labels.h, labels.min);

  return (
    <section id="network" data-tone="dark" className="cine on-dark" aria-labelledby={intro.id}>
      <div className="cine-stage">
        <div className="cine-bg" aria-hidden="true">
          {backdrops.map((k, i) => (
            <div key={k} className={`cine-photo${i === step ? " on" : ""}`}>
              <Image src={images[k].src} alt="" fill sizes="100vw" quality={70} style={{ objectFit: "cover" }} />
            </div>
          ))}
          <div className="cine-shade" />
          <div className="cine-floor" />
        </div>

        <div className="cine-map">
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <defs>
              <filter id="cine-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
              <radialGradient id="cine-halo">
                <stop offset="0" stopColor="#E8862A" stopOpacity=".55" />
                <stop offset="1" stopColor="#E8862A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="cine-cam" style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})` }}>
              <g className="cine-grat">
                {[15, 17.5, 20, 22.5, 25].map((v) => (
                  <g key={`la${v}`}>
                    <line x1={-900} x2={W + 900} y1={lat(v)} y2={lat(v)} />
                    <text x={6} y={lat(v) - 6}>{v}°N</text>
                  </g>
                ))}
                {[72.5, 75, 77.5, 80, 82.5, 85].map((v) => (
                  <g key={`lo${v}`}>
                    <line y1={-400} y2={H + 400} x1={lon(v)} x2={lon(v)} />
                    <text x={lon(v) + 6} y={H - 8}>{v}°E</text>
                  </g>
                ))}
              </g>
              <circle cx={project("VGA").x} cy={project("VGA").y} r={90} fill="url(#cine-halo)" />

              {legs.map((l, i) => {
                const on = activeCorridor < 0 || activeCorridor === l.ci;
                const delay = activeCorridor < 0 ? i * 0.25 : l.li * 0.7;
                return (
                  <g key={`${l.a}${l.b}`} className={`cine-leg${on ? " on" : ""}`} style={{ ["--d" as string]: `${delay}s` }}>
                    <path d={l.d} className="track" />
                    <path d={l.d} className="glow" pathLength={1} filter="url(#cine-glow)" />
                    <path d={l.d} className="line" pathLength={1} />
                  </g>
                );
              })}

              {!reduced &&
                legs
                  .filter((l) => activeCorridor < 0 || activeCorridor === l.ci)
                  .map((l, i) => {
                    const dur = 3 + l.km / 260;
                    const begin = 1.2 + (activeCorridor < 0 ? i * 0.6 : l.li * 1.1);
                    return (
                      <g key={`plane-${step}-${l.a}${l.b}`} className="cine-plane" opacity="0">
                        <path d={PLANE} />
                        <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" rotate="auto" path={l.d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1" />
                        <animate attributeName="opacity" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;.12;.85;1" />
                      </g>
                    );
                  })}

              {codes.map((code) => {
                const p = project(code);
                const c = cities[code];
                const on = activeCities.has(code);
                const home = code === "VGA";
                return (
                  <g key={code} className={`cine-city${on ? " on" : ""}${home ? " home" : ""}`}>
                    {on && <circle className="pulse" cx={p.x} cy={p.y} r={home ? 10 : 8} />}
                    <circle className="dot" cx={p.x} cy={p.y} r={home ? 7 : 5} />
                    <text x={p.x + c.label.dx} y={p.y + c.label.dy} textAnchor={c.label.anchor}>{names[code]}</text>
                    <text className="code" x={p.x + c.label.dx} y={p.y + c.label.dy + 15} textAnchor={c.label.anchor}>{code}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div className="cine-hud">
          <div className="cine-count" aria-hidden="true">
            <span key={step} className="num">{step === 0 ? "00" : `0${step}`}</span>
            <span className="of">/ 03</span>
            <span className="name">{step === 0 ? labels.network : `${labels.corridor} ${step}`}</span>
          </div>
          <nav className="cine-dots" aria-label={labels.network}>
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                aria-current={i === step ? "step" : undefined}
                aria-label={`${labels.step}: ${i === 0 ? labels.network : `${labels.corridor} ${i}`}`}
                onClick={() => go(i)}
              >
                <i />
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="cine-steps">
        <div className="cine-step" data-step={0} ref={(el) => { stepRefs.current[0] = el; }}>
          <div className={`cine-card intro${step === 0 ? " on" : ""}`}>
            <span className="kicker">{intro.kicker}</span>
            <h2 id={intro.id} className="h2">{intro.title}</h2>
            <p className="lead">{intro.lead}</p>
            <p className="cine-hint" aria-hidden="true"><span className="chev" />{labels.hint}</p>
          </div>
        </div>

        {corridors.map((c, i) => {
          const cityCodes = [...new Set(c.legs.flat())];
          const km = c.legs.reduce((s, [a, b]) => s + distanceKm(a, b), 0);
          const mins = c.legs.reduce((s, [a, b]) => s + blockMinutes(distanceKm(a, b)), 0);
          const on = step === i + 1;
          return (
            <div key={c.id} className="cine-step" data-step={i + 1} ref={(el) => { stepRefs.current[i + 1] = el; }}>
              <article className={`cine-card${on ? " on" : ""}`} aria-labelledby={`cine-${c.id}`}>
                <span className="label">{labels.corridor} {i + 1} · {labels.proposed}</span>
                <h3 id={`cine-${c.id}`}>{corridorText[c.id][0]}</h3>
                <p>{corridorText[c.id][1]}</p>

                <dl className="cine-stats">
                  <div>
                    <dt>{labels.total}</dt>
                    <dd><Counter value={km} run={on} format={(n) => `${n.toLocaleString("en-IN")} ${labels.km}`} /></dd>
                  </div>
                  <div>
                    <dt>{labels.time}</dt>
                    <dd><Counter value={mins} run={on} format={(n) => `~${t(n)}`} /></dd>
                  </div>
                </dl>

                <ul className="cine-cities">
                  {cityCodes.map((code) => (
                    <li key={code}>
                      <Link href={`/${locale}/routes/${cities[code].slug}`} aria-label={`${labels.explore} ${names[code]}`}>
                        <span className="ph">
                          <Image src={images[code].src} alt="" fill sizes="140px" quality={70} style={{ objectFit: "cover" }} />
                        </span>
                        <span className="nm">{names[code]}</span>
                        <span className="cd">{code}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <span className="legs">
                  {c.legs.map(([a, b]) => {
                    const d = distanceKm(a, b);
                    return (
                      <span className="leg-pill" key={a + b}>
                        {a}–{b} · {d.toLocaleString("en-IN")} {labels.km} · ~{t(blockMinutes(d))}
                      </span>
                    );
                  })}
                </span>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
