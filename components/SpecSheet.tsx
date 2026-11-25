import { fleetSpecs } from "@/lib/data";

type Key = (typeof fleetSpecs)[number]["key"];

/** Where each spec points on the plan view (drawing units, nose up). */
const pins: Record<Key, [number, number]> = {
  seats: [300, 392],
  range: [44, 266],
  cruise: [300, 44],
  ceiling: [300, 552],
  engines: [382, 214],
  runway: [334, 318],
};

/** Seat rows in a 2-2 layout, drawn as a cutaway through the high wing. */
const rows = Array.from({ length: 18 }, (_, r) => 118 + r * 19);

/**
 * The ATR 72-600 "At a glance" block as a blueprint: a plan view drawn to scale,
 * with each figure numbered and pinned to the part of the aircraft it describes.
 * The lines draw themselves once when the sheet scrolls in.
 */
export function SpecSheet({
  title,
  labels,
  sheet,
  fine,
}: {
  title: string;
  labels: Record<Key, string>;
  sheet: { plan: string; length: string; span: string; height: string };
  fine: string;
}) {
  const left = fleetSpecs.slice(0, 3);
  const right = fleetSpecs.slice(3);
  const n = (k: Key) => String(fleetSpecs.findIndex((s) => s.key === k) + 1).padStart(2, "0");

  const callout = (s: (typeof fleetSpecs)[number], i: number) => (
    <li key={s.key} className="sc" style={{ ["--i" as string]: i }}>
      <span className="sc-n">{n(s.key)}</span>
      <b className="tnum">{s.value}</b>
      <span className="sc-l">{labels[s.key]}</span>
      <i className="sc-lead" aria-hidden="true" />
    </li>
  );

  return (
    <section className="section sheet-sec" aria-labelledby="sheet-title">
      <div className="wrap">
        <div className="sheet-head reveal">
          <div>
            <span className="kicker">ATR 72-600</span>
            <h2 id="sheet-title" className="h2">{title}</h2>
          </div>
          <dl className="sheet-dims">
            <div><dt>{sheet.length}</dt><dd className="tnum">27.17 m</dd></div>
            <div><dt>{sheet.span}</dt><dd className="tnum">27.05 m</dd></div>
            <div><dt>{sheet.height}</dt><dd className="tnum">7.65 m</dd></div>
          </dl>
        </div>

        <div className="sheet reveal">
          <ul className="sheet-col l">{left.map((s, i) => callout(s, i))}</ul>

          <figure className="sheet-plane" aria-hidden="true">
            <svg viewBox="-10 -58 660 650">
              <g className="bp-grid">
                <line x1="300" y1="-40" x2="300" y2="620" />
                <line x1="-20" y1="266" x2="620" y2="266" />
              </g>

              {/* Dimension lines */}
              <g className="bp-dim">
                <path className="draw" pathLength={1} d="M30,-30 H570 M30,-38 V-22 M570,-38 V-22" />
                <text x="300" y="-40" textAnchor="middle">{sheet.span} · 27.05 m</text>
                <path className="draw" pathLength={1} d="M624,30 V572 M616,30 H632 M616,572 H632" />
                <text x="612" y="301" textAnchor="middle" transform="rotate(-90 612 301)">{sheet.length} · 27.17 m</text>
              </g>

              {/* Airframe */}
              <g className="bp-air">
                <path className="draw" pathLength={1} d="M326,240 L566,252 Q574,266 566,280 L326,292" />
                <path className="draw" pathLength={1} d="M274,240 L34,252 Q26,266 34,280 L274,292" />
                <path className="draw thin" pathLength={1} d="M326,284 L520,276 M274,284 L80,276" />
                <path className="draw" pathLength={1} d="M300,30 C316,30 326,58 326,100 L326,440 C326,488 314,536 308,572 L292,572 C286,536 274,488 274,440 L274,100 C274,58 284,30 300,30 Z" />
                <path className="draw thin" pathLength={1} d="M290,62 Q300,56 310,62 M286,72 Q300,64 314,72" />
                <path className="draw" pathLength={1} d="M300,530 L376,546 L376,560 L300,566 L224,560 L224,546 Z" />
                <path className="draw thin" pathLength={1} d="M300,486 V572" />
                {[218, 382].map((x) => (
                  <g key={x}>
                    <path className="draw" pathLength={1} d={`M${x - 10},212 Q${x - 10},200 ${x},198 Q${x + 10},200 ${x + 10},212 L${x + 10},322 Q${x},336 ${x - 10},322 Z`} />
                    <path className="draw" pathLength={1} d={`M${x - 39},196 H${x + 39}`} />
                    <ellipse className="bp-disc" cx={x} cy={196} rx={39} ry={6} />
                    <circle className="bp-hub" cx={x} cy={196} r={3.5} />
                  </g>
                ))}
                <path className="draw thin" pathLength={1} d="M274,104 h-4 M274,452 h-4 M326,104 h4 M326,452 h4" />
              </g>

              {/* Cabin, 2-2 */}
              <g className="bp-seats">
                {rows.map((y, r) => (
                  <g key={y} style={{ ["--r" as string]: r }}>
                    {[279, 288, 305, 314].map((x) => <rect key={x} x={x} y={y} width={7} height={8} rx={1.5} />)}
                  </g>
                ))}
              </g>

              {/* Numbered pins */}
              <g className="bp-pins">
                {fleetSpecs.map((s, i) => {
                  const [x, y] = pins[s.key];
                  return (
                    <g key={s.key} className="bp-pin" style={{ ["--i" as string]: i }}>
                      <circle className="ring" cx={x} cy={y} r={15} />
                      <text x={x} y={y + 4} textAnchor="middle">{n(s.key)}</text>
                    </g>
                  );
                })}
              </g>
            </svg>
            <figcaption className="sheet-tag">
              <span>ATR 72-600</span>
              <span>{sheet.plan}</span>
              <span>AIR INDO · 01</span>
            </figcaption>
          </figure>

          <ul className="sheet-col r">{right.map((s, i) => callout(s, i + 3))}</ul>
        </div>

        <p className="fine sheet-fine">{fine}</p>
      </div>
    </section>
  );
}
