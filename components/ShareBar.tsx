"use client";
import { useEffect, useState } from "react";

/** Share an article: copy the link, or open WhatsApp or LinkedIn with it filled in. */
export function ShareBar({ title, labels }: { title: string; labels: { share: string; copy: string; copied: string } }) {
  const [url, setUrl] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => setUrl(window.location.href), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 2200);
    } catch {
      window.prompt(labels.copy, url);
    }
  };
  const enc = encodeURIComponent;

  return (
    <div className="share" role="group" aria-label={labels.share}>
      <span className="share-label">{labels.share}</span>
      <a className="share-btn" href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
      </a>
      <a className="share-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.75h4V21H3V9.75Zm7 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.95c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75Z" /></svg>
      </a>
      <button type="button" className="share-btn wide" onClick={copy} aria-live="polite">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
        {done ? labels.copied : labels.copy}
      </button>
    </div>
  );
}
