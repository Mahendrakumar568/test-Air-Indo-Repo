import { FlightLines } from "./FlightLines";
import { Img } from "./Img";
import type { ImageKey } from "@/lib/images";
import { keep } from "@/lib/keep";

type Props = {
  kicker: string;
  title: string;
  lead?: string;
  image?: ImageKey;
  children?: React.ReactNode;
  facts?: [string, string][];
};

export function PageHero({ kicker, title, lead, image, children, facts }: Props) {
  return (
    <section className={`page-hero${image ? " with-image" : ""}`}>
      {image ? (
        <div className="hero-media">
          <Img slot={image} priority sizes="100vw" />
        </div>
      ) : (
        <FlightLines />
      )}
      <div className="wrap">
        <div className="head">
          <span className="kicker">{kicker}</span>
          <h1 className="h1">{keep(title)}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
          {facts && (
            <dl className="hero-facts">
              {facts.map(([v, l]) => (
                <div key={l}><dt>{l}</dt><dd className="tnum" data-count="">{v}</dd></div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
