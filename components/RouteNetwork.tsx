"use client";
import { useState } from "react";
import Link from "next/link";
import { cities, corridors, project, distanceKm, blockMinutes, type CityCode, type CorridorId } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { fmtTime } from "@/lib/format";

type Props = {
  locale: Locale;
  names: Record<CityCode, string>;
  corridorText: Record<CorridorId, string[]>;
  labels: { corridor: string; proposed: string; km: string; h: string; min: string };
  linkCities?: boolean;
};

const curve = (a: CityCode, b: CityCode) => {
  const p = project(a);
  const q = project(b);
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const k = 0.18;
  return `M${p.x} ${p.y} Q${mx - dy * k} ${my + dx * k} ${q.x} ${q.y}`;
};

export function RouteNetwork({ locale, names, corridorText, labels, linkCities = true }: Props) {
  const [active, setActive] = useState<CorridorId>("c1");
  const activeCodes = new Set(corridors.find((c) => c.id === active)!.legs.flat());

  return (
    <div className="network-grid">
      <figure className="map-card" aria-label={names.VTZ + ", " + names.VGA + ", " + names.HYD + ", " + names.GOI + ", " + names.BHO + ", " + names.PNQ}>
        <svg viewBox="0 0 600 520" role="img" aria-hidden="true">
          <defs>
            <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#8D97C2" opacity=".22" />
            </pattern>
          </defs>
          <rect width="600" height="520" fill="url(#dots)" />
          {[70, 150, 230, 310, 390].map((r) => (
            <circle key={r} cx={project("VGA").x} cy={project("VGA").y} r={r} fill="none" stroke="#8D97C2" strokeOpacity=".14" />
          ))}
          {corridors.flatMap((c) =>
            c.legs.map(([a, b]) => (
              <path key={`${a}-${b}`} d={curve(a, b)} className={`map-leg${c.id === active ? " on" : ""}`} />
            )),
          )}
          {(Object.keys(cities) as CityCode[]).map((code) => {
            const p = project(code);
            const c = cities[code];
            const on = activeCodes.has(code);
            const home = code === "VGA";
            return (
              <g key={code} className="map-city">
                {home && <circle cx={p.x} cy={p.y} r={14} fill="#E8862A" opacity=".25" />}
                <circle cx={p.x} cy={p.y} r={home ? 8 : 6} fill={home ? "#E8862A" : on ? "#F2B33D" : "#F7F2E8"} />
                <text x={p.x + c.label.dx} y={p.y + c.label.dy} textAnchor={c.label.anchor}>
                  {names[code]}
                </text>
                <text className="code" x={p.x + c.label.dx} y={p.y + c.label.dy + 15} textAnchor={c.label.anchor}>
                  {code}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="map-legend">
          <span><i />{labels.proposed}</span>
        </figcaption>
      </figure>

      <div className="corridor-list">
        {corridors.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className="corridor"
            aria-pressed={c.id === active}
            onClick={() => setActive(c.id)}
            onMouseEnter={() => setActive(c.id)}
            onFocus={() => setActive(c.id)}
          >
            <span className="label">
              {labels.corridor} {i + 1} · {labels.proposed}
            </span>
            <h3>{corridorText[c.id][0]}</h3>
            <p>{corridorText[c.id][1]}</p>
            <span className="legs">
              {c.legs.map(([a, b]) => {
                const km = distanceKm(a, b);
                return (
                  <span className="leg-pill" key={a + b}>
                    {a}–{b} · {km.toLocaleString("en-IN")} {labels.km} · ~{fmtTime(blockMinutes(km), labels.h, labels.min)}
                  </span>
                );
              })}
            </span>
          </button>
        ))}
        {linkCities && (
          <p className="fine" style={{ marginTop: 8 }}>
            {(Object.keys(cities) as CityCode[]).map((code, i) => (
              <span key={code}>
                {i > 0 && " · "}
                <Link href={`/${locale}/routes/${cities[code].slug}`}>{names[code]}</Link>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
