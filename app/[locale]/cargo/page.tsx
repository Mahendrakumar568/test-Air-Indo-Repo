import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Img } from "@/components/Img";
import { Icon, type IconName } from "@/components/Icon";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/cargo", { page: "cargo" }) : {};
}

const icons: IconName[] = ["clock", "mail", "route"];

export default async function Cargo({ params }: PageProps) {
  const { locale, t } = await resolve(params);
  const c = t.cargo;
  return (
    <>
      <PageHero kicker={c.kicker} title={c.title} lead={c.lead} image="cargo" />

      <section className="section">
        <div className="wrap split">
          <div className="reveal">
            <span className="kicker">{t.home.cargoKicker}</span>
            <h2 className="h2" style={{ marginTop: 14 }}>{c.postTitle}</h2>
            <p className="lead" style={{ marginTop: 20 }}>{c.postLead}</p>
            <p className="notice-box" style={{ marginTop: 28 }}>{c.status}</p>
          </div>
          <div className="media r-3-2 reveal"><Img slot="news3" sizes="(max-width: 960px) 100vw, 560px" /></div>
        </div>
      </section>

      <section className="section bg-navy cargo-route" aria-label={c.benefits.map((b) => b[0]).join(", ")}>
        <div className="wrap">
          <svg className="cr-arc reveal" viewBox="0 0 1200 170" aria-hidden="true">
            <path className="cr-ground" d="M0,150 H1200" />
            <path className="cr-path" pathLength={1} d="M80,150 C320,-10 880,-10 1120,150" />
            <circle className="cr-city" cx="80" cy="150" r="7" />
            <circle className="cr-city" cx="1120" cy="150" r="7" />
            <path className="cr-plane" transform="translate(620 10) rotate(90) scale(1.1)" d="M20 2c1.5 0 2.3 1.8 2.3 4.2V15l6-.1V12h2.6v2.9l7.1.1v4l-15.7 1.6v9.6l5 1.6v3l-7.3-.8-7.3.8v-3l5-1.6v-9.6L2 19v-4l7.1-.1V12h2.6v2.9l6 .1V6.2C17.7 3.8 18.5 2 20 2Z" />
          </svg>
          <div className="cr-ends" aria-hidden="true"><span>VGA</span><span>HYD</span></div>
          <ol className="cr-steps">
            {c.benefits.map(([title, body], i) => (
              <li key={title} className="reveal" style={{ ["--i" as string]: i }}>
                <span className="cr-icon"><Icon name={icons[i]} /></span>
                <span className="cr-n tnum">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap split split-top manifest-split">
          <div className="manifest-col reveal">
            <div className="manifest">
              <div className="manifest-bar"><span>AIR INDO CARGO</span><span className="tnum">AWB 0001</span></div>
              <h2 className="h2">{c.servicesTitle}</h2>
              <ol className="manifest-list">
                {c.services.map((s, i) => (
                  <li key={s} style={{ ["--i" as string]: i }}>
                    <span className="mf-n tnum">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mf-name">{s}</span>
                    <span className="mf-icon"><Icon name="parcel" /></span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="media manifest-photo"><Img slot="cargo" sizes="(max-width: 960px) 100vw, 560px" /></div>
          </div>
          <div className="form-panel" id="enquiry">
            <h2 className="h3">{c.ctaTitle}</h2>
            <p className="body" style={{ margin: "8px 0 24px" }}>{c.ctaLead}</p>
            <ContactForm locale={locale} t={t.forms} defaultTopic="cargo" idPrefix="cg" />
          </div>
        </div>
      </section>
    </>
  );
}
