import { milestones } from "@/lib/data";
import type { Dict } from "@/lib/dict/en";
import { Icon } from "./Icon";

export function Timeline({ t }: { t: Dict }) {
  return (
    <ol className="timeline">
      {milestones.map((m, i) => {
        const [title, body, state] = t.milestones[m.key];
        return (
          <li key={m.key} className={m.state} aria-current={m.state === "current" ? "step" : undefined}>
            <span className="dot" aria-hidden="true">
              {m.state === "done" ? <Icon name="check" size={16} /> : i + 1}
            </span>
            <h3>{title}</h3>
            <p>{body}</p>
            <span className="state">{state}</span>
          </li>
        );
      })}
    </ol>
  );
}
