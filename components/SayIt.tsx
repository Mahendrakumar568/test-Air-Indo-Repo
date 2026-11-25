"use client";
import { useEffect, useRef, useState } from "react";

/** How to voice a greeting, best first: a recording if we have one, then voices by language. */
type Try = { lang: string; text: string };

/**
 * Play button for the "Say it like a local" tile. Uses a recorded clip when one exists
 * (public/audio/greet-<code>.mp3), otherwise the device's own voice for that language, and falls back
 * to an Indian-English voice reading the romanised word, so every device says something sensible.
 */
export function SayIt({ src, tries, label, stopLabel }: { src: string | null; tries: Try[]; label: string; stopLabel: string }) {
  const [playing, setPlaying] = useState(false);
  const [ok, setOk] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) setOk(false);
    // Voices load asynchronously in Chrome; asking once warms the list.
    try { speechSynthesis.getVoices(); } catch {}
    return () => {
      try { speechSynthesis.cancel(); } catch {}
      audio.current?.pause();
    };
  }, []);

  const speak = () => {
    const voices = speechSynthesis.getVoices();
    const norm = (l: string) => l.toLowerCase().replace("_", "-");
    for (const t of tries) {
      const want = norm(t.lang);
      const base = want.split("-")[0];
      const v = voices.find((x) => norm(x.lang) === want) || voices.find((x) => norm(x.lang).split("-")[0] === base);
      if (v || t === tries[tries.length - 1]) {
        const u = new SpeechSynthesisUtterance(t.text);
        u.lang = v?.lang || t.lang;
        if (v) u.voice = v;
        u.rate = 0.82;
        u.onend = u.onerror = () => setPlaying(false);
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
        setPlaying(true);
        return;
      }
    }
  };

  const play = async () => {
    if (playing) {
      try { speechSynthesis.cancel(); } catch {}
      audio.current?.pause();
      setPlaying(false);
      return;
    }
    if (src) {
      const a = audio.current ?? new Audio(src);
      audio.current = a;
      a.onended = () => setPlaying(false);
      try {
        a.currentTime = 0;
        await a.play();
        setPlaying(true);
        return;
      } catch {}
    }
    if (ok) speak();
  };

  return (
    <button type="button" className={`sayit${playing ? " on" : ""}`} onClick={play} aria-label={playing ? stopLabel : label} aria-pressed={playing}>
      <span className="sayit-icon" aria-hidden="true">
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
        )}
      </span>
      <span className="sayit-wave" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ ["--i" as string]: i }} />)}</span>
      <span className="sayit-label">{label}</span>
    </button>
  );
}
