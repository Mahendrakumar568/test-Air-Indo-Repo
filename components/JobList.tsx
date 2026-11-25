"use client";
import { useState } from "react";
import { jobs } from "@/lib/data";

type Props = {
  depts: Record<string, string>;
  jobText: Record<string, string[]>;
  cityNames: Record<string, string>;
  labels: { all: string; fullTime: string; apply: string; search: string; none: string };
};

export function JobList({ depts, jobText, cityNames, labels }: Props) {
  const [dept, setDept] = useState<string>("all");
  const used = Array.from(new Set(jobs.map((j) => j.dept)));
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = jobs.filter(
    (j) =>
      (dept === "all" || j.dept === dept) &&
      (!needle || [...jobText[j.id], depts[j.dept], cityNames[j.location]].join(" ").toLowerCase().includes(needle)),
  );

  return (
    <div>
      <div className="job-search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input type="search" className="input" placeholder={labels.search} aria-label={labels.search} value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="job-count tnum" aria-live="polite">{shown.length}/{jobs.length}</span>
      </div>
      <div className="filters" role="group">
        <button type="button" className="chip" aria-pressed={dept === "all"} onClick={() => setDept("all")}>
          {labels.all}
        </button>
        {used.map((d) => (
          <button key={d} type="button" className="chip" aria-pressed={dept === d} onClick={() => setDept(d)}>
            {depts[d]}
          </button>
        ))}
      </div>
      <ul className="job-list" style={{ listStyle: "none" }} aria-live="polite">
        {shown.map((j) => (
          <li key={j.id} className="job">
            <div>
              <h3>{jobText[j.id][0]}</h3>
              <p>{jobText[j.id][1]}</p>
            </div>
            <div className="tags">
              <span>{depts[j.dept]}</span>
              <span>{cityNames[j.location]}</span>
              <span>{labels.fullTime}</span>
            </div>
            <a className="btn btn-ghost" href={`#apply-${j.id}`}>
              {labels.apply}
            </a>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="job-none">{labels.none}</p>}
    </div>
  );
}
