import Link from "next/link";
import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Img } from "@/components/Img";
import { Icon, type IconName } from "@/components/Icon";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/about", { page: "about" }) : {};
}

const valueIcons: IconName[] = ["route", "plane", "pin", "shield", "clock", "spark"];
const safetyIcons: IconName[] = ["plane", "people", "shield"];
const audienceLinks = ["/investors#deck", "/contact?topic=partnership", "/careers", "/newsroom"];

export default async function About({ params }: PageProps) {
  const { locale, t } = await resolve(params);
  const a = t.about;
  const h = t.home;
  const L = (p: string) => `/${locale}${p}`;
  return (
    <>
      <PageHero kicker={a.kicker} title={a.title} lead={a.lead} image="heritage" />

      <section className="section">
        <div className="wrap split split-top">
          <div className="stack reveal" style={{ ["--gap" as string]: "22px" }}>
            {a.story.map((p, i) => (
              <p key={i} className={i === 0 ? "story-lead" : "body"} style={i === 0 ? undefined : { fontSize: 17.5, lineHeight: 1.75 }}>
                {p}
              </p>
            ))}
          </div>
          <figure className="reveal">
            <div className="media r-4-5 symbol-panel">
              <img src="/brand/air-indo-symbol-reversed.svg" alt="" width={240} height={243} style={{ width: "44%", height: "auto" }} />
            </div>
            <blockquote style={{ marginTop: 28 }}>
              <p className="display" style={{ fontSize: "clamp(24px, 2.4vw, 32px)", lineHeight: 1.3 }}>“{a.founderQuote}”</p>
              <footer style={{ marginTop: 14, color: "var(--muted)" }}>
                <b style={{ color: "var(--navy)" }}>{a.founderName}</b> · {a.founderRole}
              </footer>
            </blockquote>
          </figure>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 56 }}>
            <span className="kicker">{a.valuesKicker}</span>
            <h2 className="h2">{a.valuesTitle}</h2>
          </div>
          <div className="grid g3">
            {a.values.map(([title, body], i) => (
              <div key={title} className={`card-line reveal${i < 3 ? " saffron" : ""}`}>
                <div className="icon-badge"><Icon name={valueIcons[i]} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-band">
        <div className="media"><Img slot="arrival" sizes="(max-width: 900px) 100vw, 50vw" /></div>
        <div className="feature-copy bg-navy on-dark">
          <span className="kicker">{a.safetyKicker}</span>
          <h2 className="h2" style={{ marginTop: 14 }}>{a.safetyTitle}</h2>
          <p className="lead" style={{ marginTop: 20 }}>{a.safetyLead}</p>
          <div className="stack" style={{ marginTop: 36, ["--gap" as string]: "22px" }}>
            {a.safety.map(([title, body], i) => (
              <div key={title} style={{ display: "flex", gap: 16 }}>
                <div className="icon-badge" style={{ margin: 0, flex: "none" }}><Icon name={safetyIcons[i]} /></div>
                <div>
                  <h3 className="h4" style={{ color: "var(--ivory)" }}>{title}</h3>
                  <p className="body" style={{ marginTop: 4 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Audiences */}
      <section id="work-with-us" className="section" aria-labelledby="aud-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 40 }}>
            <span className="kicker">{h.audienceKicker}</span>
            <h2 id="aud-title" className="h2">{h.audienceTitle}</h2>
          </div>
          <ul className="rows">
            {h.audiences.map(([title, body, cta], i) => (
              <li key={title} className="reveal">
                <Link href={L(audienceLinks[i])} className="row-link">
                  <span className="num">0{i + 1}</span>
                  <span className="row-title">{title}</span>
                  <span className="row-body">{body}</span>
                  <span className="row-cta">{cta} <Icon name="arrow" size={18} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  );
}
