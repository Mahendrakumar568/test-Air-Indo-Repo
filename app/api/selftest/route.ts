import { put, get, del } from "@vercel/blob";
export const dynamic = "force-dynamic";
// Temporary: verifies private Blob storage works in production. Removed after the check.
export async function GET() {
  try {
    const r = await put("selftest/ping.json", JSON.stringify({ at: Date.now() }), { access: "private", addRandomSuffix: true, contentType: "application/json" });
    const g = await get(r.pathname, { access: "private" });
    const text = g ? await new Response(g.stream).text() : null;
    await del(r.url);
    return Response.json({ ok: !!text, wrote: r.pathname, read: text });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
