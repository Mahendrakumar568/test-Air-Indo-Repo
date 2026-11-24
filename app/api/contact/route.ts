import { contactSchema, issuesToErrors } from "@/lib/validation";
import { saveSubmission } from "@/lib/store";
import { notifyTeam } from "@/lib/notify";
import { botReply, json, meta, precheck } from "@/lib/handler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const early = precheck(req, "contact");
  if (early) return early;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, errors: issuesToErrors(parsed.error.issues) }, 422);
  const d = parsed.data;
  const bot = botReply(d.website, d.ts);
  if (bot) return bot;

  try {
    const { website, ts, ...data } = d;
    void website; void ts;
    const saved = await saveSubmission("contact", { ...data, ...meta(req) });
    await notifyTeam(`New ${d.topic} enquiry from ${d.name}`, { ...data, id: saved.id }, d.email);
    return json({ ok: true, id: saved.id });
  } catch (e) {
    console.error("contact save failed", e);
    return json({ ok: false, error: "server" }, 500);
  }
}
