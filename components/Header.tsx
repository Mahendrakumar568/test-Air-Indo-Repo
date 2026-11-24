"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { locales, localeNames, type Locale } from "@/lib/i18n";

type NavLabels = {
  home: string; about: string; routes: string; fleet: string; experience: string; cargo: string;
  investors: string; careers: string; newsroom: string; contact: string; joinWaitlist: string;
  menu: string; close: string; language: string; primary: string;
};

const items = ["about", "routes", "fleet", "experience", "cargo", "investors", "careers", "newsroom", "contact"] as const;

export function Header({ locale, t }: { locale: Locale; t: NavLabels }) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const rest = pathname.replace(/^\/(en|te|hi)(?=\/|$)/, "");
  const isActive = (slug: string) => rest === `/${slug}` || rest.startsWith(`/${slug}/`);
  const setLangCookie = (l: Locale) => {
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
  };

  const links = items.map((key) => (
    <li key={key}>
      <Link href={`/${locale}/${key}`} aria-current={isActive(key) ? "page" : undefined}>
        {t[key]}
      </Link>
    </li>
  ));

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href={`/${locale}`} className="brand" aria-label={`Air Indo, ${t.home}`}>
          <img src="/brand/air-indo-lockup-colour.svg" alt="Air Indo · Fly Beyond" width={183} height={38} />
        </Link>
        <nav aria-label={t.primary} style={{ marginLeft: "auto" }}>
          <ul className="nav-links">{links}</ul>
        </nav>
        <div className="nav-tools">
          <div className="lang" role="group" aria-label={t.language}>
            {locales.map((l) => (
              <a
                key={l}
                href={`/${l}${rest}`}
                lang={localeNames[l].htmlLang}
                hrefLang={localeNames[l].htmlLang}
                aria-current={l === locale ? "true" : undefined}
                aria-label={localeNames[l].native}
                onClick={() => setLangCookie(l)}
              >
                {localeNames[l].short}
              </a>
            ))}
          </div>
          <Link href={`/${locale}#waitlist`} className="btn btn-primary">
            {t.joinWaitlist}
          </Link>
        </div>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.close : t.menu}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div id="mobile-menu" className="mobile-panel" data-open={open} aria-hidden={!open} inert={!open ? true : undefined}>
        <nav aria-label={t.primary}>
          <ul>{links}</ul>
        </nav>
        <Link href={`/${locale}#waitlist`} className="btn btn-primary" onClick={() => setOpen(false)}>
          {t.joinWaitlist}
        </Link>
      </div>
    </header>
  );
}
