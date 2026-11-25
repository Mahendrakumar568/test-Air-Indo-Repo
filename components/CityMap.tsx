import { cities, allLegs, project, connectionsOf, type CityCode } from "@/lib/data";

const curve = (a: CityCode, b: CityCode) => {
  const p = project(a);
  const q = project(b);
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  return `M${p.x} ${p.y} Q${mx - (q.y - p.y) * 0.18} ${my + (q.x - p.x) * 0.18} ${q.x} ${q.y}`;
};

/** Small static route map for one city: its own links glow, the rest of the network sits quietly behind. */
export function CityMap({ code, names, label }: { code: CityCode; names: Record<CityCode, string>; label: string }) {
  const links = new Set(connectionsOf(code));
  const codes = Object.keys(cities) as CityCode[];
  return (
    <figure className="citymap" aria-label={label}>
      <svg viewBox="0 0 600 520" aria-hidden="true">
        {allLegs.map((l) => {
          const on = l.from === code || l.to === code;
          const d = on && l.to === code ? curve(l.to, l.from) : curve(l.from, l.to);
          return <path key={l.from + l.to} d={d} pathLength={1} className={on ? "cm-on" : "cm-off"} />;
        })}
        {codes.map((c) => {
          const p = project(c);
          const self = c === code;
          const on = self || links.has(c);
          const lb = cities[c].label;
          return (
            <g key={c} className={`cm-city${on ? " on" : ""}${self ? " self" : ""}`}>
              {self && <circle className="cm-pulse" cx={p.x} cy={p.y} r={12} />}
              <circle cx={p.x} cy={p.y} r={self ? 8 : 5.5} />
              <text x={p.x + lb.dx} y={p.y + lb.dy} textAnchor={lb.anchor}>{names[c]}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
