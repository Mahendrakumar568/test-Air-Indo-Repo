import { resolve, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Img } from "@/components/Img";
import { Icon, type IconName } from "@/components/Icon";
import type { ImageKey } from "@/lib/images";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "/experience", { page: "experience" }) : {};
}

const pillarIcons: IconName[] = ["seat", "language", "food", "fare", "access", "clock"];
const journeyImages: ImageKey[] = ["news2", "checkin", "boarding", "meal", "arrival"];

export default async function Experience({ params }: PageProps) {
  const { t } = await resolve(params);
  const e = t.experience;
  return (
    <>
      <PageHero kicker={e.kicker} title={e.title} lead={e.lead} image="cabin" />

      <section className="section">
        <div className="wrap">
          <div className="grid g3">
            {e.pillars.map(([title, body], i) => (
              <div key={title} className="card-line reveal">
                <div className="icon-badge"><Icon name={pillarIcons[i]} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-band bg-navy">
        <div className="media"><Img slot="crew" sizes="(max-width: 900px) 100vw, 50vw" /></div>
        <div className="feature-copy on-dark">
          <span className="kicker">{t.home.experienceKicker}</span>
          <h2 className="h2" style={{ marginTop: 14 }}>{t.home.experienceTitle}</h2>
          <p className="lead" style={{ marginTop: 20 }}>{t.home.experienceLead}</p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="wrap">
          <div className="head reveal" style={{ marginBottom: 48 }}>
            <h2 className="h2">{e.journeyTitle}</h2>
          </div>
          <ol className="grid g3" style={{ listStyle: "none" }}>
            {e.journey.map(([title, body], i) => (
              <li key={title} className="reveal">
                <div className="media r-3-2"><Img slot={journeyImages[i]} sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px" /></div>
                <span className="num" style={{ display: "block", marginTop: 18 }}>0{i + 1}</span>
                <h3 className="h4" style={{ marginTop: 4 }}>{title}</h3>
                <p className="body" style={{ marginTop: 6, fontSize: 15.5 }}>{body}</p>
              </li>
            ))}
          </ol>
          <p className="fine" style={{ marginTop: 40 }}>{e.fine}</p>
        </div>
      </section>
    </>
  );
}
