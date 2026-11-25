"use client";
import { useEffect, useState } from "react";

/** Floating index of the page's sections (desktop only): shows where you are and jumps on click. */
export function SectionIndex({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
            setDark((e.target as HTMLElement).dataset.tone === "dark");
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const go = (id: string) => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav className={`sindex${dark ? " on-dark-ui" : ""}`} aria-label={label}>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <button type="button" onClick={() => go(it.id)} aria-current={active === it.id ? "true" : undefined}>
              <span className="sl">{it.label}</span>
              <span className="sn">{String(i + 1).padStart(2, "0")}</span>
              <i />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
