import "@fontsource-variable/inter/index.css";
import "../globals.css";

export const metadata = { title: "Air Indo · Submissions", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "var(--paper)" }}>{children}</body>
    </html>
  );
}
