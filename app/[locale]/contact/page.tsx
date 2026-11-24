import { resolve } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { enquiryTopics, type EnquiryTopic } from "@/lib/data";
import { company } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";
import { ContactForm } from "@/components/forms/ContactForm";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ topic?: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/contact", { page: "contact" }) : {};
}

export default async function Contact({ params, searchParams }: Props) {
  const { locale, t } = await resolve(params);
  const { topic } = await searchParams;
  const c = t.contact;
  const preset = (enquiryTopics as readonly string[]).includes(topic ?? "") ? (topic as EnquiryTopic) : "";
  const tbc = <span style={{ color: "var(--stone)" }}>{t.common.toBeConfirmed}</span>;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <>
      <PageHero kicker={c.kicker} title={c.title} lead={c.lead} image="office" />
      <section className="section">
        <div className="wrap split split-top">
          <div>
            <h2 className="h3">{c.channelsTitle}</h2>
            <ul style={{ listStyle: "none", marginTop: 24 }} className="stack">
              <li style={{ display: "flex", gap: 16 }}>
                <span style={{ color: "var(--saffron)" }}><Icon name="mail" /></span>
                <div>
                  <b style={{ display: "block", color: "var(--navy)" }}>{c.emailLabel}</b>
                  {company.email ? <a href={`mailto:${company.email}`}>{company.email}</a> : tbc}
                </div>
              </li>
              <li style={{ display: "flex", gap: 16 }}>
                <span style={{ color: "var(--saffron)" }}><Icon name="phone" /></span>
                <div>
                  <b style={{ display: "block", color: "var(--navy)" }}>{c.phoneLabel}</b>
                  {company.phone ? <a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a> : tbc}
                  <span className="fine" style={{ display: "block" }}>{c.hours}</span>
                </div>
              </li>
              <li style={{ display: "flex", gap: 16 }}>
                <span style={{ color: "var(--saffron)" }}><Icon name="pin" /></span>
                <div>
                  <b style={{ display: "block", color: "var(--navy)" }}>{c.officeLabel}</b>
                  <span style={{ whiteSpace: "pre-line" }}>{company.address || c.officeValue}</span>
                  <span className="fine" style={{ display: "block" }}>
                    {c.cin}: {company.cin || t.common.toBeConfirmed}
                  </span>
                </div>
              </li>
            </ul>
            <h2 className="h3" style={{ marginTop: 56 }}>{c.faqTitle}</h2>
            <div className="faq" style={{ marginTop: 12 }}>
              {c.faq.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="form-panel" id="form">
            <ContactForm locale={locale} t={t.forms} defaultTopic={preset} />
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
