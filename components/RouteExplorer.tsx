"use client";
import { useMemo, useState } from "react";
import { cityList, connectionsOf, distanceKm, blockMinutes, type CityCode } from "@/lib/data";
import { Icon } from "./Icon";
import { fmtTime } from "@/lib/format";

type Props = {
  names: Record<CityCode, string>;
  t: { title: string; lead: string; swap: string; fine: string };
  labels: { from: string; to: string; distance: string; estimated: string; status: string; proposed: string; km: string; h: string; min: string };
};

export function RouteExplorer({ names, t, labels }: Props) {
  const [from, setFrom] = useState<CityCode>("VTZ");
  const [to, setTo] = useState<CityCode>("VGA");
  const options = useMemo(() => connectionsOf(from), [from]);
  const dest = options.includes(to) ? to : options[0];
  const km = distanceKm(from, dest);

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
          <b className="tnum">~{fmtTime(blockMinutes(km), labels.h, labels.min)}</b>
        </div>
        <div>
          <small>{labels.status}</small>
          <b>{labels.proposed}</b>
        </div>
      </div>
      <p className="fine" style={{ marginTop: 12 }}>{t.fine}</p>
    </div>
  );
}
