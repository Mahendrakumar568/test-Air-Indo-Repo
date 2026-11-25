"use client";
import { useState } from "react";

type Labels = { window: string; aisle: string; row: string; front: string; pick: string };

const ROWS = 18;
const LETTERS = ["A", "B", "C", "D"] as const;
/** A and D sit by the windows; B and C sit on the aisle. There is no middle seat. */
const kind = (l: (typeof LETTERS)[number]) => (l === "A" || l === "D" ? "window" : "aisle");

export function SeatMap({ labels }: { labels: Labels }) {
  const [sel, setSel] = useState<string | null>("12A");
  const row = sel ? Number(sel.slice(0, -1)) : 0;
  const letter = sel ? (sel.slice(-1) as (typeof LETTERS)[number]) : null;

  return (
    <div className="seatmap">
      <div className="seat-info" aria-live="polite">
        {sel && letter ? (
          <>
            <b className="seat-code">{sel}</b>
            <span className={`seat-kind ${kind(letter)}`}>{labels[kind(letter)]}</span>
            <span className="seat-row">{labels.row} {row}</span>
          </>
        ) : (
          <span className="seat-row">{labels.pick}</span>
        )}
      </div>
      <div className="fuselage">
        <span className="nose" aria-hidden="true"><i>{labels.front}</i></span>
        <div className="cabin" role="grid" aria-label={labels.pick}>
          {Array.from({ length: ROWS }, (_, r) => r + 1).map((r) => (
            <div key={r} role="row" className="seat-row-g" style={{ ["--r" as string]: r }}>
              {LETTERS.map((l) => {
                const id = `${r}${l}`;
                return (
                  <button
                    key={id}
                    type="button"
                    role="gridcell"
                    className={`seat ${kind(l)} s${l}`}
                    aria-pressed={sel === id}
                    aria-label={`${id}, ${labels[kind(l)]}`}
                    onClick={() => setSel(id)}
                    onMouseEnter={() => setSel(id)}
                  />
                );
              })}
              <span className="rownum" aria-hidden="true">{r}</span>
            </div>
          ))}
        </div>
        <span className="tail" aria-hidden="true" />
      </div>
      <div className="seat-legend" aria-hidden="true">
        <span><i className="window" /> {labels.window}</span>
        <span><i className="aisle" /> {labels.aisle}</span>
      </div>
    </div>
  );
}
