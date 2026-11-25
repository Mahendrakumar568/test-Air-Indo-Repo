"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { images } from "@/lib/images";
import { alts } from "@/lib/alts";
import type { CityCode } from "@/lib/data";

type Item = { code: CityCode; href: string; name: string; tagline: string; state: string };

/** Horizontal, snap-scrolling gallery of tall destination cards with previous / next controls. */
export function DestinationRail({ items, prev, next }: { items: Item[]; prev: string; next: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    on();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      el.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="rail">
      <ul ref={ref} className="rail-track">
        {items.map((it, i) => (
          <li key={it.code}>
            <Link href={it.href} className="rail-card">
              <Image src={images[it.code].src} alt={alts[it.code]} fill sizes="(max-width: 640px) 82vw, (max-width: 1100px) 44vw, 400px" quality={75} />
              <span className="rail-shade" />
              <span className="rail-idx">0{i + 1}</span>
              <span className="rail-meta">
                <span className="rail-state">{it.state} · {it.code}</span>
                <span className="rail-name">{it.name}</span>
                <span className="rail-tag">{it.tagline}</span>
              </span>
              <span className="rail-go" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="rail-ctrl">
        <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label={prev}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label={next}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
