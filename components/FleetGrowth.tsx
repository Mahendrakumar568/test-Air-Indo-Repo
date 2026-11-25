import { phases } from "@/lib/data";

type PhaseText = Record<(typeof phases)[number]["key"], readonly string[]>;

/** The fleet plan as a timeline: a saffron track draws across and each phase fills in with aircraft. */
export function FleetGrowth({ phases: text, aircraft }: { phases: PhaseText; aircraft: string }) {
  const f = { phases: text, aircraft };
  return (
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
  );
}
