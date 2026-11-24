import { listSubmissions, type Kind } from "@/lib/store";

export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s; // avoid spreadsheet formula injection
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  const kind = (new URL(req.url).searchParams.get("kind") || "waitlist") as Kind;
  if (!["waitlist", "contact", "careers"].includes(kind)) return new Response("Bad kind", { status: 400 });
  const rows = await listSubmissions(kind, 1000);
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const csv = [cols.map(cell).join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="air-indo-${kind}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
