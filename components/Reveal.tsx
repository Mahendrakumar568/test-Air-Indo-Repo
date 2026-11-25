"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";


/** Wraps every word of a heading in two spans so CSS can lift the words in one after another. */
function splitWords(el: HTMLElement) {
  if (el.dataset.split) return;
  el.dataset.split = "1";
  let i = 0;
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent || "").split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(p));
            return;
          }
          const outer = document.createElement("span");
          outer.className = "w";
          const inner = document.createElement("span");
          inner.className = "wi";
          inner.style.setProperty("--i", String(i++));
          inner.textContent = p;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !(child as HTMLElement).classList.contains("w")) {
        walk(child);
      }
    });
  };
  walk(el);
  el.classList.add("wsplit");
}

/**
 * Scroll-driven entrances: fades in .reveal blocks, lifts headline words in, wipes images open
 *. No-JS and reduced-motion users see everything at once.
 */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (el: Element) => {
      el.classList.add("in");
    };
    if (!reduced) {
      document.querySelectorAll<HTMLElement>("main :is(.h2, .h1, .display-xl, .manifesto-quote, .next-name)").forEach((el) => {
        if (!el.closest(".cine")) splitWords(el);
      });
    }
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in), .wsplit:not(.in), [data-count]:not(.in)"));
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
