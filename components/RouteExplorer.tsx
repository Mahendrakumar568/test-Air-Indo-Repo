"use client";
import { useMemo, useState } from "react";
import { cityList, connectionsOf, distanceKm, blockMinutes, type CityCode } from "@/lib/data";
import { Icon } from "./Icon";
import { fmtTime } from "@/lib/format";

type Props = {
  names: Record<CityCode, string>;
  t: { title: string; lead: string; swap: string; fine: string; byRoad: string; byAir: string; saved: string; roadNote: string };
  labels: { from: string; to: string; distance: string; estimated: string; status: string; proposed: string; km: string; h: string; min: string };
};

export function RouteExplorer({ names, t, labels }: Props) {
  const [from, setFrom] = useState<CityCode>("VTZ");
  const [to, setTo] = useState<CityCode>("VGA");
  const options = useMemo(() => connectionsOf(from), [from]);
  const dest = options.includes(to) ? to : options[0];
  const km = distanceKm(from, dest);
  const air = blockMinutes(km);
  // Road distance is roughly 1.3x the straight line; about 55 km/h average including stops.
  const road = Math.round(((km * 1.32) / 55) * 60 / 15) * 15;
  const saved = Math.max(0, road - air);
  const t2 = (m: number) => fmtTime(m, labels.h, labels.min);

  const swap = () => {
    setFrom(dest);
    setTo(from);
  };

  return (
    <div className="explorer">
      <h3>{t.title}</h3>
      <p className="sub">{t.lead}</p>
      <div className="explorer-row">
        <div className="field">
          <label htmlFor="ex-from">{labels.from}</label>
          <select id="ex-from" className="select" value={from} onChange={(e) => setFrom(e.target.value as CityCode)}>
            {cityList.map((c) => (
              <option key={c.code} value={c.code}>
                {names[c.code]} ({c.code})
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="swap" onClick={swap} aria-label={t.swap} title={t.swap}>
          <Icon name="swap" size={20} />
        </button>
        <div className="field">
          <label htmlFor="ex-to">{labels.to}</label>
          <select id="ex-to" className="select" value={dest} onChange={(e) => setTo(e.target.value as CityCode)}>
            {options.map((c) => (
              <option key={c} value={c}>
                {names[c]} ({c})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="result" aria-live="polite">
        <div>
          <small>{labels.distance}</small>
          <b className="tnum">{km.toLocaleString("en-IN")} {labels.km}</b>
        </div>
        <div>
          <small>{labels.estimated}</small>
          <b className="tnum">~{t2(air)}</b>
        </div>
        <div>
          <small>{labels.status}</small>
          <b>{labels.proposed}</b>
        </div>
      </div>
      <div className="vs" aria-live="polite">
        <div className="vs-row">
          <span className="vs-label">{t.byRoad}</span>
          <span className="vs-track"><span className="vs-bar road" style={{ width: "100%" }} /></span>
          <span className="vs-val tnum">~{t2(road)}</span>
        </div>
        <div className="vs-row">
          <span className="vs-label">{t.byAir}</span>
          <span className="vs-track"><span className="vs-bar air" style={{ width: `${Math.max(6, (air / road) * 100)}%` }} /></span>
          <span className="vs-val tnum">~{t2(air)}</span>
        </div>
        <p className="vs-saved"><span>{t.saved}</span> <b className="tnum">~{t2(saved)}</b></p>
      </div>
      <p className="fine" style={{ marginTop: 12 }}>{t.fine} {t.roadNote}</p>
    </div>
  );
}
