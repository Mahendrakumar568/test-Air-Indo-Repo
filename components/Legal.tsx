import type { Dict } from "@/lib/dict/en";
import { legalUpdated } from "@/lib/legal";

export function Legal({ t, title, sections }: { t: Dict; title: string; sections: { h: string; p: string[] }[] }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="legal">
          <span className="kicker">{t.common.lastUpdated}: {legalUpdated}</span>
          <h1 className="h2" style={{ marginTop: 12 }}>{title}</h1>
          {t.legal.englishOnly && <p className="notice-box" style={{ marginTop: 24 }}>{t.legal.englishOnly}</p>}
          <div lang="en">
            {sections.map((s) => (
              <div key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
