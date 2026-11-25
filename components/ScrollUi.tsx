"use client";
import { useEffect, useRef, useState } from "react";

/** Thin reading-progress bar at the top and a back-to-top button that fills as you scroll. */
export function ScrollUi({ label }: { label: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      bar.current?.style.setProperty("--p", p.toFixed(4));
      btn.current?.style.setProperty("--p", p.toFixed(4));
      setOn(scrollY > innerHeight * 1.2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const top = () => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <>
      <div ref={bar} className="progress" aria-hidden="true" />
      <button ref={btn} type="button" className={`to-top${on ? " on" : ""}`} onClick={top} aria-label={label} tabIndex={on ? 0 : -1}>
        <svg width="52" height="52" viewBox="0 0 52 52" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
          <circle className="ring" cx="26" cy="26" r="24" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      </button>
    </>
  );
}
