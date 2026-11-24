import { listSubmissions, type Kind } from "@/lib/store";

const tabs: { kind: Kind; label: string; cols: string[] }[] = [
  { kind: "waitlist", label: "Waitlist", cols: ["receivedAt", "email", "name", "from", "to", "locale", "source"] },
  { kind: "contact", label: "Enquiries", cols: ["receivedAt", "topic", "name", "email", "phone", "organisation", "message"] },
  { kind: "careers", label: "Applications", cols: ["receivedAt", "role", "name", "email", "phone", "city", "experience", "licence", "linkedin", "cv", "message"] },
];

const fmt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const active = tabs.find((t) => t.kind === tab) ?? tabs[0];
  const rows = await listSubmissions(active.kind);
  const storage = !!process.env.BLOB_READ_WRITE_TOKEN;

  return (
    <div className="wrap" style={{ padding: "40px var(--gutter)", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <img src="/brand/air-indo-lockup-colour.svg" alt="Air Indo" height={34} style={{ height: 34, width: "auto" }} />
        <h1 className="h3" style={{ marginLeft: "auto" }}>Website submissions</h1>
      </div>
      {!storage && <p className="form-status bad" style={{ marginTop: 20 }}>Storage is not connected (BLOB_READ_WRITE_TOKEN is missing).</p>}
      <nav className="filters" style={{ marginTop: 28 }}>
        {tabs.map((t) => (
          <a key={t.kind} href={`/admin?tab=${t.kind}`} className="chip" aria-pressed={t.kind === active.kind} style={{ textDecoration: "none" }}>
            {t.label}
          </a>
        ))}
        <a href={`/admin/export?kind=${active.kind}`} className="chip" style={{ marginLeft: "auto", textDecoration: "none" }}>
          Download CSV
        </a>
      </nav>
      <p className="fine">{rows.length} {active.label.toLowerCase()}</p>
      <div style={{ overflowX: "auto", marginTop: 12, background: "#fff", border: "1px solid var(--mist)" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
          <thead>
            <tr>
              {active.cols.map((c) => (
                <th key={c} style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid var(--mist)", whiteSpace: "nowrap", color: "var(--stone)", fontWeight: 600 }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={fmt(r.id)}>
                {active.cols.map((c) => (
                  <td key={c} style={{ padding: "10px 12px", borderBottom: "1px solid var(--mist)", verticalAlign: "top", maxWidth: 360, whiteSpace: c === "message" ? "pre-wrap" : "nowrap" }}>
                    {c === "cv" && r.cv ? (
                      <a href={`/admin/file?path=${encodeURIComponent(fmt(r.cv))}`}>{fmt(r.cvName) || "CV"}</a>
                    ) : c === "receivedAt" ? (
                      new Date(fmt(r[c])).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                    ) : (
                      fmt(r[c])
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={active.cols.length} style={{ padding: 24, color: "var(--stone)" }}>No submissions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
