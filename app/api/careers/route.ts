import { careerSchema, issuesToErrors, CV_MAX_BYTES, CV_TYPES } from "@/lib/validation";
import { saveFile, saveSubmission } from "@/lib/store";
import { notifyTeam } from "@/lib/notify";
import { botReply, json, meta, precheck } from "@/lib/handler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const early = precheck(req, "careers");
  if (early) return early;
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }
  const fields: Record<string, unknown> = {};
  form.forEach((v, k) => {
    if (typeof v === "string") fields[k] = v;
  });
  fields.consent = fields.consent === "true" || fields.consent === "on";
  if (fields.experience === "") delete fields.experience;

  const parsed = careerSchema.safeParse(fields);
  const errors: Record<string, string> = parsed.success ? {} : issuesToErrors(parsed.error.issues);

  const cv = form.get("cv");
  const file = cv instanceof File && cv.size > 0 ? cv : null;
  if (file && file.size > CV_MAX_BYTES) errors.cv = "cvTooLarge";
  else if (file && file.type && !CV_TYPES.includes(file.type)) errors.cv = "cvType";

  if (!parsed.success || Object.keys(errors).length) return json({ ok: false, errors }, 422);
  const d = parsed.data;
  const bot = botReply(d.website, d.ts);
  if (bot) return bot;

  try {
    const { website, ts, ...data } = d;
    void website; void ts;
    const sid = crypto.randomUUID().slice(0, 8);
    const cvPath = file ? await saveFile("careers", sid, file) : null;
    const saved = await saveSubmission("careers", { ...data, cv: cvPath, cvName: file?.name ?? null, ...meta(req) });
    await notifyTeam(`New application: ${d.role} from ${d.name}`, { ...data, cv: file?.name ?? "none", id: saved.id }, d.email);
    return json({ ok: true, id: saved.id });
  } catch (e) {
    console.error("careers save failed", e);
    return json({ ok: false, error: "server" }, 500);
  }
}
