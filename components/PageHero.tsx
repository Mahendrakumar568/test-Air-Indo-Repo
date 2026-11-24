import { FlightLines } from "./FlightLines";
import { Img } from "./Img";
import type { ImageKey } from "@/lib/images";

type Props = {
  kicker: string;
  title: string;
  lead?: string;
  image?: ImageKey;
  children?: React.ReactNode;
};

export function PageHero({ kicker, title, lead, image, children }: Props) {
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
          <h1 className="h1">{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
