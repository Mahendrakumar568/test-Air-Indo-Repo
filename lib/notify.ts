import "server-only";

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Email the team about a new submission through Resend, if configured.
 * Never throws: a failed email must not lose a submission that was already stored.
 */
export async function notifyTeam(subject: string, fields: Record<string, unknown>, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!key || !to) return false;
  const from = process.env.NOTIFY_EMAIL_FROM || "Air Indo Website <onboarding@resend.dev>";
  const rows = Object.entries(fields)
    .filter(([, v]) => v !== "" && v !== undefined && v !== null)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#77757F;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#15151B;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("");
  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:640px"><h2 style="color:#10215C;font-weight:500">${esc(subject)}</h2><table style="border-collapse:collapse;font-size:14px">${rows}</table></div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject, html, reply_to: replyTo }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
