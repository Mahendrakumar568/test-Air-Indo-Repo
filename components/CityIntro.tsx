"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Dot = { code: string; x: number; y: number; self: boolean; linked: boolean };
type Leg = { d: string; on: boolean };
type Panel = { src: string | null; label: string; name: string };

export type CityIntroProps = {
  code: string;
  name: string;
  state: string;
  coords: string;
  greeting: string;
  skip: string;
  aerial: string;
  alt: string;
  descend: string;
  dots: Dot[];
  legs: Leg[];
  panels: Panel[];
};

const key = (code: string) => `ai-intro-${code}`;

/**
 * Opening sequence for a destination page, about nine seconds long:
 * the wing grows from its saffron point, the network finds the city, three local scenes open,
 * then the city's name lands and the curtain lifts. Plays once per visit, can be skipped,
 * and never plays with reduced motion. A tiny inline script decides before first paint,
 * so the page never flashes underneath.
 */
export function CityIntro(p: CityIntroProps) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro === p.code) {
      setOn(true);
    } else {
      let seen = true;
      try { seen = !!sessionStorage.getItem(key(p.code)); } catch {}
      if (!seen && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        try { sessionStorage.setItem(key(p.code), "1"); } catch {}
        html.dataset.intro = p.code;
        setOn(true);
      }
    }
    return () => { if (html.dataset.intro === p.code) delete html.dataset.intro; };
  }, [p.code]);

  const end = () => {
    delete document.documentElement.dataset.intro;
    setOn(false);
  };

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && end();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [on]);

  const xs = p.dots.map((d) => d.x);
  const ys = p.dots.map((d) => d.y);
  const pad = 60;
  const box = `${Math.min(...xs) - pad} ${Math.min(...ys) - pad} ${Math.max(...xs) - Math.min(...xs) + pad * 2} ${Math.max(...ys) - Math.min(...ys) + pad * 2}`;

  const boot = `(function(){try{var k=${JSON.stringify(key(p.code))};if(matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');document.documentElement.dataset.intro=${JSON.stringify(p.code)};}catch(e){}})();`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: boot }} />
      {(
        <div className="ci" onAnimationEnd={(e) => e.target === e.currentTarget && e.animationName === "ci-out" && end()}>
          <div className="ci-act ci-logo" aria-hidden="true">
            <img src="/brand/air-indo-symbol-reversed.svg" alt="" width={120} height={121} />
            <span className="ci-word">AIR INDO</span>
          </div>

          <div className="ci-act ci-map" aria-hidden="true">
            <svg viewBox={box}>
              {p.legs.map((l, i) => <path key={i} d={l.d} pathLength={1} className={l.on ? "on" : ""} />)}
              {p.dots.map((d, i) => (
                <g key={d.code} className={`ci-dot${d.self ? " self" : ""}${d.linked ? " linked" : ""}`} style={{ ["--i" as string]: i }}>
                  {d.self && <circle className="ci-ring" cx={d.x} cy={d.y} r={16} />}
                  <circle cx={d.x} cy={d.y} r={d.self ? 7 : 4.5} />
                  {(d.self || d.linked) && <text x={d.x} y={d.y - 16} textAnchor="middle">{d.code}</text>}
                </g>
              ))}
            </svg>
            <p className="ci-caption"><b>{p.state}</b><span>{p.coords}</span></p>
          </div>

          <div className="ci-act ci-dive" aria-hidden="true">
            <span className="ci-aerial"><Image src={p.aerial} alt="" fill sizes="100vw" quality={70} loading="eager" /></span>
            <span className="ci-streaks" />
            <span className="ci-cloud c3" />
            <span className="ci-cloud c2" />
            <span className="ci-cloud c1" />
            <span className="ci-hud"><span className="ci-reticle" /></span>
            <span className="ci-alt">
              {p.alt}
              <span className="ci-alt-steps">
                {["3,000 m", "1,200 m", "300 m"].map((a, i) => <span key={a} style={{ ["--t" as string]: `${4.75 + i * 0.85}s` }}><b>{a}</b></span>)}
              </span>
            </span>
            <span className="ci-into">{p.descend.split("{city}")[0]}<b>{p.name}</b>{p.descend.split("{city}")[1]}</span>
          </div>

          <div className="ci-act ci-panels" aria-hidden="true">
            {p.panels.map((pn, i) => (
              <figure key={i} style={{ ["--i" as string]: i }}>
                <span className="ci-img">{pn.src && <Image src={pn.src} alt="" fill sizes="(max-width: 640px) 100vw, 34vw" quality={70} loading="eager" />}</span>
                <figcaption><span>{pn.label}</span><b>{pn.name}</b></figcaption>
              </figure>
            ))}
          </div>

          <div className="ci-act ci-title" aria-hidden="true">
            <span className="ci-hello">{p.greeting}</span>
            <span className="ci-name">
              {/^[A-Za-z\s.'-]+$/.test(p.name)
                ? Array.from(p.name).map((ch, i) => <span key={i} style={{ ["--i" as string]: i }}>{ch === " " ? "\u00a0" : ch}</span>)
                : <span className="ci-whole">{p.name}</span>}
            </span>
            <span className="ci-state"><i />{p.state} · {p.code}<i /></span>
          </div>

          <button type="button" className="ci-skip" onClick={end}>
            {p.skip}
            <span className="ci-bar" aria-hidden="true"><span /></span>
          </button>
        </div>
      )}
    </>
  );
}
