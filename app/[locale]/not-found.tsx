import Link from "next/link";
import { FlightLines } from "@/components/FlightLines";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <FlightLines />
      <div className="wrap">
        <span className="kicker">404</span>
        <h1 className="h1">This page has flown away.</h1>
        <p className="lead">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="btn-row" style={{ marginTop: 32 }}>
          <Link href="/" className="btn btn-primary">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
