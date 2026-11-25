"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Closing call to action above the footer. Hidden on the home page, which ends with the waitlist itself. */
export function FooterCta({ href, title, lead, cta }: { href: string; title: string; lead: string; cta: string }) {
  const path = usePathname() || "";
  if (/^\/(en|te|hi)\/?$/.test(path)) return null;
  return (
    <section className="footer-cta" aria-label={cta}>
      <div className="wrap">
        <div>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
        <Link href={href} className="btn btn-primary btn-lg">{cta}</Link>
      </div>
    </section>
  );
}
