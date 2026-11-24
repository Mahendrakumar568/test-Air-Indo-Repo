import "server-only";
import { put, list, get } from "@vercel/blob";

export type Kind = "waitlist" | "contact" | "careers";

const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

const id = () => {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const rand = crypto.randomUUID().slice(0, 8);
  return `${stamp}-${rand}`;
};

/** Persist one submission as a private JSON blob. Returns its id. */
export async function saveSubmission(kind: Kind, data: Record<string, unknown>) {
  const sid = id();
  const record = { id: sid, kind, receivedAt: new Date().toISOString(), ...data };
  if (!hasBlob()) {
    // Local development without storage: log so nothing is silently lost.
    console.info(`[submission:${kind}]`, JSON.stringify(record));
    return { id: sid, stored: false };
  }
  await put(`submissions/${kind}/${sid}.json`, JSON.stringify(record, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return { id: sid, stored: true };
}

export async function saveFile(kind: Kind, sid: string, file: File) {
  if (!hasBlob()) return null;
  const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(-80);
  const res = await put(`uploads/${kind}/${sid}/${safe}`, file, {
    access: "private",
    contentType: file.type || "application/octet-stream",
    addRandomSuffix: true,
  });
  return res.pathname;
}

export async function listSubmissions(kind: Kind, limit = 500) {
  if (!hasBlob()) return [];
  const { blobs } = await list({ prefix: `submissions/${kind}/`, limit });
  const sorted = blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
  const records = await Promise.all(
    sorted.map(async (b) => {
      try {
        const r = await get(b.pathname, { access: "private" });
        if (!r) return null;
        const text = await new Response(r.stream).text();
        return JSON.parse(text) as Record<string, unknown>;
      } catch {
        return null;
      }
    }),
  );
  return records.filter(Boolean) as Record<string, unknown>[];
}

export async function readFile(pathname: string) {
  if (!hasBlob()) return null;
  return get(pathname, { access: "private" });
}
