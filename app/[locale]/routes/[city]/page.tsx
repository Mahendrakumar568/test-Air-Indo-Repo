import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { culture, cultureLabels, placeKm, motifOf, greetingVoice } from "@/lib/culture";
import { SayIt } from "@/components/SayIt";
import { notFound } from "next/navigation";
import { resolve } from "@/lib/page";
import { pageMeta } from "@/lib/seo";
import { isLocale, locales } from "@/lib/i18n";
import { getDict } from "@/lib/dict";
import { cityBySlug, cityList, connectionsOf, distanceKm, blockMinutes, corridorsOfCity, cities, allLegs, project, type CityCode } from "@/lib/data";
import { fmtTime } from "@/lib/format";
import { Img } from "@/components/Img";
import { Icon } from "@/components/Icon";
import { CityMap } from "@/components/CityMap";
import { CityIntro } from "@/components/CityIntro";
import { images } from "@/lib/images";

type Props = { params: Promise<{ locale: string; city: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => cityList.map((c) => ({ locale, city: c.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, city } = await params;
  const c = cityBySlug(city);
  if (!isLocale(locale) || !c) return {};
  const t = getDict(locale);
  const ct = t.cities[c.code];
  return pageMeta(locale, `/routes/${c.slug}`, { title: `${ct.name} (${c.code})`, description: `${ct.tagline} ${ct.about}`.slice(0, 300), og: "routes" });
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const { locale, t, names } = await resolve(params);
  const c = cityBySlug(city);
  if (!c) notFound();
  const ct = t.cities[c.code];
  const conns = connectionsOf(c.code);
  const corrs = corridorsOfCity(c.code);
  const shortest = Math.min(...conns.map((to) => blockMinutes(distanceKm(c.code, to))));
  const q = t.routes.quick;
  const cu = culture[locale][c.code];
  const cl = cultureLabels[locale];
  /** Culture photos are optional: use one only if it has been added to public/images/city. */
  const photo = (kind: "craft" | "food" | "place" | "aerial") => {
    const f = `/images/city/${kind}-${c.code.toLowerCase()}.webp`;
    return existsSync(join(process.cwd(), "public", f)) ? f : null;
  };

  const curve = (a: CityCode, b: CityCode) => {
    const P = project(a);
    const Q = project(b);
    const mx = (P.x + Q.x) / 2;
    const my = (P.y + Q.y) / 2;
    return `M${P.x} ${P.y} Q${mx - (Q.y - P.y) * 0.18} ${my + (Q.x - P.x) * 0.18} ${Q.x} ${Q.y}`;
  };
  const intro = {
    code: c.code,
    name: ct.name,
    state: ct.state,
    coords: `${c.lat.toFixed(2)}° N · ${c.lon.toFixed(2)}° E`,
    greeting: cu.word.script,
    skip: cl.skip,
    aerial: photo("aerial") ?? images[c.code].src,
    alt: cl.alt,
    descend: cl.descend,
    dots: cityList.map((x) => ({ code: x.code, ...project(x.code), self: x.code === c.code, linked: conns.includes(x.code) })),
    legs: allLegs.map((l) => {
      const on = l.from === c.code || l.to === c.code;
      return { d: on && l.to === c.code ? curve(l.to, l.from) : curve(l.from, l.to), on };
    }),
    panels: [
      { src: photo("craft"), label: cl.craft, name: cu.craft.name },
      { src: photo("food"), label: cl.food, name: cu.food.name },
      { src: photo("place"), label: cl.nearby, name: cu.places[0].name },
    ],
  };

  return (
    <>
      <CityIntro {...intro} />
      <section className="page-hero with-image" style={{ minHeight: "min(72vh, 640px)", display: "flex", alignItems: "flex-end" }}>
        <div className="hero-media"><Img slot={c.code} priority sizes="100vw" /></div>
        <div className="wrap" style={{ width: "100%" }}>
          <nav aria-label="Breadcrumb" className="fine" style={{ color: "#c9cee6", marginBottom: 18 }}>
            <Link href={`/${locale}/routes`} style={{ color: "var(--gold)" }}>{t.common.allRoutes}</Link> / {ct.name}
          </nav>
          <span className="kicker">{ct.state} · {c.code}</span>
          <h1 className="h1">{ct.name}</h1>
          <p className="lead">{ct.tagline}</p>
          <dl className="hero-facts">
            <div><dt>{q.airport}</dt><dd>{c.code}</dd></div>
            <div><dt>{q.links}</dt><dd data-count="">{conns.length}</dd></div>
            <div><dt>{q.shortest}</dt><dd>~{fmtTime(shortest, t.common.hours, t.common.minutes)}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section culture" data-motif={motifOf[c.code]}>
        <div className="wrap">
          <div className="culture-head reveal">
            <span className="kicker">{cl.kicker.replace("{city}", ct.name)}</span>
            <h2 className="h2">{cl.title}</h2>
          </div>
          <div className="bento">
            <figure className={`tile tile-craft reveal${photo("craft") ? " has-img" : ""}`}>
              {photo("craft") && <Image src={photo("craft")!} alt={cu.craft.name} fill sizes="(max-width: 860px) 100vw, 42vw" quality={78} />}
              <figcaption>
                <span className="tile-label">{cl.craft}</span>
                <span className="tile-name">{cu.craft.name}</span>
                <span className="tile-line">{cu.craft.line}</span>
                <span className="tile-also">{cu.craft.also}</span>
              </figcaption>
            </figure>
            <figure className={`tile tile-food reveal${photo("food") ? " has-img" : ""}`}>
              {photo("food") && <Image src={photo("food")!} alt={cu.food.name} fill sizes="(max-width: 860px) 100vw, 56vw" quality={78} />}
              <figcaption>
                <span className="tile-label">{cl.food}</span>
                <span className="tile-name">{cu.food.name}</span>
                <span className="tile-line">{cu.food.line}</span>
              </figcaption>
            </figure>
            <figure className="tile tile-word reveal">
              <span className="tile-label">{cl.word}</span>
              <span className="word-script" lang={c.code === "HYD" ? "ur" : undefined}>{cu.word.script}</span>
              <span className="word-roman">{cu.word.roman}</span>
              <span className="tile-line">{cu.word.meaning}</span>
              <SayIt src={existsSync(join(process.cwd(), "public", `audio/greet-${c.code.toLowerCase()}.mp3`)) ? `/audio/greet-${c.code.toLowerCase()}.mp3` : null} tries={greetingVoice[c.code]} label={cl.listen} stopLabel={cl.stop} />
            </figure>
            <figure className={`tile tile-place reveal${photo("place") ? " has-img" : ""}`}>
              {photo("place") && <Image src={photo("place")!} alt={cu.places[0].name} fill sizes="(max-width: 860px) 100vw, 30vw" quality={78} />}
              <figcaption>
                <span className="tile-label">{cl.nearby}</span>
                <span className="tile-name">{cu.places[0].name}</span>
              </figcaption>
            </figure>
          </div>
          <ol className="nearby">
            {cu.places.map((pl, i) => (
              <li key={pl.name} className="reveal">
                <span className="nearby-n">0{i + 1}</span>
                <span className="nearby-km">{placeKm[c.code][i] ? `${placeKm[c.code][i]} ${cl.km}` : cl.inCity}</span>
                <b>{pl.name}</b>
                <span>{pl.line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-sm bg-ivory">
        <div className="wrap split split-top">
          <div className="reveal">
            <span className="kicker">{ct.state} · {c.code}</span>
            <h2 className="h2" style={{ marginTop: 14 }}>{cl.fly.replace("{city}", ct.name)}</h2>
            <p className="lead" style={{ marginTop: 18 }}>{ct.about}</p>
            <dl className="facts" style={{ marginTop: 32 }}>
              <div><dt>{t.routes.airport}</dt><dd>{ct.airport} ({c.code})</dd></div>
              <div><dt>{t.routes.corridorLabel}</dt><dd>{corrs.map((id) => t.corridors[id][0]).join(" / ")}</dd></div>
            </dl>
            <Link href={`/${locale}/#waitlist`} className="btn btn-primary" style={{ marginTop: 32 }}>
              {cl.notify.replace("{city}", ct.name)} <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="reveal">
            <div className="map-panel">
              <CityMap code={c.code} names={names} label={`${t.routes.connections}: ${conns.map((x) => names[x]).join(", ")}`} />
              <h2 className="h3">{t.routes.connections}</h2>
              <ul className="conn-list">
                {conns.map((to) => {
                  const km = distanceKm(c.code, to);
                  return (
                    <li key={to}>
                      <Link href={`/${locale}/routes/${cities[to].slug}`} className="conn">
                        <span className="conn-route"><b>{c.code}</b><i /><b>{to}</b></span>
                        <span className="conn-name">{names[to]}</span>
                        <span className="conn-meta tnum">{km.toLocaleString("en-IN")} {t.common.km} · ~{fmtTime(blockMinutes(km), t.common.hours, t.common.minutes)}</span>
                        <Icon name="arrow" size={18} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {(() => {
        const i = cityList.findIndex((x) => x.code === c.code);
        const n = cityList[(i + 1) % cityList.length];
        return (
          <Link href={`/${locale}/routes/${n.slug}`} className="next-band">
            <span className="next-media"><Img slot={n.code} sizes="100vw" alt="" /></span>
            <span className="wrap next-copy">
              <span className="kicker">{t.common.nextDestination}</span>
              <span className="next-name">{names[n.code]}</span>
              <span className="next-tag">{t.cities[n.code].tagline}</span>
            </span>
            <span className="next-go" aria-hidden="true"><Icon name="arrow" size={26} /></span>
          </Link>
        );
      })()}
      <div className="wrap" style={{ paddingBlock: 28 }}>
        <p className="fine">{t.common.notice}</p>
      </div>
    </>
  );
}
