import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/dict/en";
import { FooterCta } from "./FooterCta";

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const l = (p: string) => `/${locale}${p}`;
  const year = new Date().getFullYear();
  return (
    <>
    <FooterCta href={l("/#waitlist")} title={t.home.closingTitle} lead={t.home.closingLead} cta={t.nav.joinWaitlist} />
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
        <p className="footer-mark" aria-hidden="true">Air Indo</p>
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/brand/air-indo-lockup-reversed.svg" alt="Air Indo · Fly Beyond" width={212} height={44} loading="lazy" />
            <p>{t.footer.blurb}</p>
          </div>
          <div>
            <h2>{t.footer.fly}</h2>
            <ul>
              <li><Link href={l("/routes")}>{t.nav.routes}</Link></li>
              <li><Link href={l("/fleet")}>{t.nav.fleet}</Link></li>
              <li><Link href={l("/experience")}>{t.nav.experience}</Link></li>
              <li><Link href={l("/cargo")}>{t.nav.cargo}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t.footer.company}</h2>
            <ul>
              <li><Link href={l("/about")}>{t.nav.about}</Link></li>
              <li><Link href={l("/investors")}>{t.nav.investors}</Link></li>
              <li><Link href={l("/careers")}>{t.nav.careers}</Link></li>
              <li><Link href={l("/newsroom")}>{t.nav.newsroom}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t.footer.help}</h2>
            <ul>
              <li><Link href={l("/contact")}>{t.nav.contact}</Link></li>
              <li><Link href={l("/#waitlist")}>{t.nav.joinWaitlist}</Link></li>
              <li><Link href={l("/privacy")}>{t.footer.privacy}</Link></li>
              <li><Link href={l("/terms")}>{t.footer.terms}</Link></li>
            </ul>
          </div>
        </div>
        </div>
        <div className="footer-legal">
          <p>
            <strong>{t.footer.regulatoryTitle}</strong> {t.common.notice}
          </p>
          <div className="footer-bottom">
            <span>© {year} Air Indo Airlines. {t.footer.rights}</span>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
