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

      <section className="section-sm bg-ivory">
        <div className="wrap grid g3">
          {c.benefits.map(([title, body], i) => (
            <div key={title} className="card reveal">
              <div className="icon-badge"><Icon name={icons[i]} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap split split-top">
          <div className="reveal">
            <h2 className="h2">{c.servicesTitle}</h2>
            <ul style={{ listStyle: "none", marginTop: 28 }} className="stack">
              {c.services.map((s) => (
                <li key={s} style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 18, paddingBottom: 14, borderBottom: "1px solid var(--mist)" }}>
                  <span style={{ color: "var(--saffron)" }}><Icon name="parcel" /></span> {s}
                </li>
              ))}
            </ul>
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
