"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { images } from "@/lib/images";
import { alts } from "@/lib/alts";
import type { CityCode } from "@/lib/data";

type Item = { code: CityCode; href: string; name: string; tagline: string; state: string };

/**
 * Destination gallery. On larger screens the section pins while you scroll and the cards glide
 * sideways with the page; on phones (or with reduced motion) it is a normal swipeable row.
 */
export function DestinationRail({ items, head }: { items: Item[]; head: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);
  const travel = useRef(0);

  useEffect(() => {
    const mq = matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const on = () => setPinned(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const o = outer.current;
    const tr = track.current;
    if (!o || !tr) return;
    if (!pinned) {
      o.style.height = "";
      tr.style.transform = "";
      return;
    }
    let raf = 0;
    const measure = () => {
      travel.current = Math.max(0, tr.scrollWidth - window.innerWidth);
      o.style.height = `calc(100svh - var(--header-h) + ${travel.current}px)`;
      update();
    };
    const update = () => {
      raf = 0;
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 76;
      const top = o.getBoundingClientRect().top - header;
      const p = travel.current ? Math.min(1, Math.max(0, -top / travel.current)) : 0;
      tr.style.transform = `translate3d(${-p * travel.current}px, 0, 0)`;
      bar.current?.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, [pinned]);

  /** Keyboard users: bring a focused card into view by scrolling the page to its position. */
  const onFocus = (i: number) => {
    const o = outer.current;
    const tr = track.current;
    if (!pinned || !o || !tr) return;
    const card = tr.children[i] as HTMLElement;
    const p = Math.min(1, Math.max(0, (card.offsetLeft - window.innerWidth * 0.3) / (travel.current || 1)));
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 76;
    window.scrollTo({ top: o.getBoundingClientRect().top + scrollY - header + p * travel.current });
  };

  return (
    <div ref={outer} className={`hs${pinned ? " pinned" : ""}`}>
      <div className="hs-pin">
        {head}
        <ul ref={track} className="rail-track">
          {items.map((it, i) => (
            <li key={it.code}>
              <Link href={it.href} className="rail-card" onFocus={() => onFocus(i)}>
                <Image src={images[it.code].src} alt={alts[it.code]} fill sizes="(max-width: 640px) 82vw, (max-width: 1100px) 44vw, 420px" quality={75} />
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
        <div className="wrap hs-progress" aria-hidden="true"><span ref={bar} /></div>
      </div>
    </div>
  );
}
