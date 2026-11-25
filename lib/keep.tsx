import { Fragment } from "react";

/** Keeps aircraft type names such as "ATR 72-600" on one line inside headings. */
export function keep(text: string) {
  const parts = text.split(/(ATR 72-600)/);
  return parts.map((p, i) => (p === "ATR 72-600" ? <span key={i} style={{ whiteSpace: "nowrap" }}>{p}</span> : <Fragment key={i}>{p}</Fragment>));
}
