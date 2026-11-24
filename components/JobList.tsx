"use client";
import { useState } from "react";
import { jobs } from "@/lib/data";

type Props = {
  depts: Record<string, string>;
  jobText: Record<string, string[]>;
  cityNames: Record<string, string>;
  labels: { all: string; fullTime: string; apply: string };
};

export function JobList({ depts, jobText, cityNames, labels }: Props) {
  const [dept, setDept] = useState<string>("all");
  const used = Array.from(new Set(jobs.map((j) => j.dept)));
  const shown = jobs.filter((j) => dept === "all" || j.dept === dept);

  return (
    <div>
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
    </div>
  );
}
