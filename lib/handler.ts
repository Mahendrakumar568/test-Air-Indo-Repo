import "server-only";
import { NextResponse } from "next/server";
import { clientIp, looksLikeBot, rateLimited, sameOrigin } from "./guard";

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Shared checks for every form endpoint. Returns a response to send early, or null to continue. */
export function precheck(req: Request, bucket: string) {
  if (!sameOrigin(req)) return json({ ok: false, error: "forbidden" }, 403);
  if (rateLimited(`${bucket}:${clientIp(req)}`)) return json({ ok: false, error: "rate_limited" }, 429);
  return null;
}

/** Bots get a fake success so they learn nothing. */
export const botReply = (website?: string, ts?: number) => (looksLikeBot(website, ts) ? json({ ok: true }) : null);

export const meta = (req: Request) => ({
  ip: clientIp(req),
  userAgent: (req.headers.get("user-agent") || "").slice(0, 200),
  referer: (req.headers.get("referer") || "").slice(0, 200),
});
