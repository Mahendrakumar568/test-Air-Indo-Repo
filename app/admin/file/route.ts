import { readFile } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get("path") || "";
  if (!path.startsWith("uploads/")) return new Response("Not found", { status: 404 });
  const r = await readFile(path);
  if (!r) return new Response("Not found", { status: 404 });
  const name = path.split("/").pop() || "file";
  return new Response(r.stream, {
    headers: {
      "Content-Type": r.blob.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name.replace(/"/g, "")}"`,
      "Cache-Control": "no-store",
    },
  });
}
