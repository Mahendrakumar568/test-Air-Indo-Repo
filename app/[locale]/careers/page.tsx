import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { jobs } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Img } from "@/components/Img";
import { Icon } from "@/components/Icon";
import { JobList } from "@/components/JobList";
import { CareerForm } from "@/components/forms/CareerForm";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/careers", { page: "careers", og: "careers" }) : {};
}

const cultureImages = ["crew", "careersTraining", "checkin"] as const;

export default async function Careers({ params }: PageProps) {
  const { locale, t, names } = await resolve(params);
  const c = t.careers;
  const jobTitles = Object.fromEntries(jobs.map((j) => [j.id, c.jobs[j.id][0]]));
  const jsonLd = jobs.map((j) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: t.careers.jobs[j.id][0],
    description: t.careers.jobs[j.id][1],
    employmentType: "FULL_TIME",
    datePosted: "2026-11-24",
    hiringOrganization: { "@type": "Organization", name: "Air Indo Airlines", sameAs: "https://airindo.in" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: names[j.location], addressCountry: "IN" } },
  }));

  return (
    <>
      <PageHero kicker={c.kicker} title={c.title} lead={c.lead} image="careersTeam" facts={[[String(jobs.length), c.openTitle], [String(new Set(jobs.map((j) => j.dept)).size), c.filterAll], [String(new Set(jobs.map((j) => j.location)).size), t.home.stats[0][1]]]}>
        <div className="btn-row" style={{ marginTop: 32 }}>
          <a href="#roles" className="btn btn-primary">{c.openTitle}</a>
        </div>
      </PageHero>

      <section className="section culture2" aria-labelledby="culture-title">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 56 }}>
            <span className="kicker">{c.kicker}</span>
            <h2 id="culture-title" className="h2">{c.cultureTitle}</h2>
          </div>
          <ol className="culture2-row">
            {c.culture.map(([title, body], i) => (
              <li key={title} className="reveal" style={{ ["--i" as string]: i }}>
                <div className="media culture2-img"><Img slot={cultureImages[i]} sizes="(max-width: 960px) 100vw, 33vw" /></div>
                <span className="culture2-n tnum">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-ivory" id="roles">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 32 }}>
            <h2 className="h2">{c.openTitle}</h2>
            <p className="lead">{c.openLead}</p>
          </div>
          <JobList
            depts={c.depts}
            jobText={c.jobs}
            cityNames={names}
            labels={{ all: c.filterAll, fullTime: c.fullTime, apply: c.apply, search: t.common.search, none: t.common.noResults }}
          />
        </div>
      </section>

      <section className="feature-band bg-navy">
        <div className="media"><Img slot="careersTraining" sizes="(max-width: 900px) 100vw, 50vw" /></div>
        <div className="feature-copy on-dark">
          <h2 className="h2">{c.processTitle}</h2>
          <ol className="stack" style={{ listStyle: "none", marginTop: 32, ["--gap" as string]: "20px" }}>
            {c.process.map(([title, body], i) => (
              <li key={title} style={{ display: "flex", gap: 18 }}>
                <span className="num" style={{ color: "var(--gold)", minWidth: 24 }}>0{i + 1}</span>
                <div>
                  <h3 className="h4" style={{ color: "var(--ivory)" }}>{title}</h3>
                  <p className="body" style={{ marginTop: 4 }}>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="apply">
        <div className="wrap split split-top">
          <div className="apply-col reveal">
            <div className="head">
              <span className="kicker">{c.kicker}</span>
              <h2 className="h2">{c.applyTitle}</h2>
              <p className="lead">{c.applyLead}</p>
            </div>
            <figure className="media apply-photo">
              <Img slot="boarding" sizes="(max-width: 960px) 100vw, 560px" />
              <figcaption>{c.equal}</figcaption>
            </figure>
            <p className="apply-warn"><Icon name="shield" /> <span><b>{t.contact.faq[4][0]}</b> {t.contact.faq[4][1]}</span></p>
          </div>
          <div className="form-panel">
            {/* anchors so "Apply" links (#apply-<role>) scroll here and preselect the role */}
            {jobs.map((j) => <span key={j.id} id={`apply-${j.id}`} />)}
            <CareerForm locale={locale} t={t.forms} jobTitles={jobTitles} />
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
