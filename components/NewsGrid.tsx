"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { images, type ImageKey } from "@/lib/images";
import { alts } from "@/lib/alts";

type Post = { slug: string; tag: string; image: ImageKey; title: string; excerpt: string };

/** Newsroom cards with topic filters. The first post is shown large as the lead story. */
export function NewsGrid({ posts, tags, all, href }: { posts: Post[]; tags: Record<string, string>; all: string; href: string }) {
  const [tag, setTag] = useState("all");
  const shown = posts.filter((p) => tag === "all" || p.tag === tag);
  return (
    <>
      <div className="filters" role="group">
        <button type="button" className="chip" aria-pressed={tag === "all"} onClick={() => setTag("all")}>{all}</button>
        {Object.entries(tags).map(([k, v]) => (
          <button key={k} type="button" className="chip" aria-pressed={tag === k} onClick={() => setTag(k)}>{v}</button>
        ))}
      </div>
      <div className="news-grid" aria-live="polite">
        {shown.map((p, i) => (
          <Link key={p.slug} href={`${href}/${p.slug}`} className={`news-card${i === 0 && shown.length > 1 ? " lead-story" : ""}`}>
            <div className="media">
              <Image src={images[p.image].src} alt={alts[p.image]} width={images[p.image].width} height={images[p.image].height} sizes="(max-width: 760px) 100vw, 640px" />
            </div>
            <div className="news-body">
              <span className="kicker tag">{tags[p.tag]}</span>
              <h2 className="h3">{p.title}</h2>
              <p>{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
