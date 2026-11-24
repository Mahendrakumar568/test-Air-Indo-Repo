import "server-only";

const hits = new Map<string, number[]>();

/** Best-effort per-instance rate limit: `max` requests per `windowMs` per key. */
export function rateLimited(key: string, max = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

export const clientIp = (req: Request) =>
  req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

/** Reject obvious bots: a filled honeypot or a form submitted within 1.5s of rendering. */
export const looksLikeBot = (website?: string, ts?: number) =>
  !!website || (typeof ts === "number" && ts > 0 && Date.now() - ts < 1500);

export const sameOrigin = (req: Request) => {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(req.url).host || new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
};
