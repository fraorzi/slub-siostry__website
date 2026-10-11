import type { CSSProperties, ReactNode } from "react";

const PER_LINE = 6;
const SAG = 34;

export type Print = { key: string; node: ReactNode; caption?: string };

/** Sznurek z odbitkami przypiętymi klamerkami. Zwis liczony jak parabola, odbitki lekko się kołyszą. */
export const Clothesline = ({ prints, className = "" }: { prints: Print[]; className?: string }) => (
  <div className={`line ${className}`}>
    <div className="line__inner">
    <svg aria-hidden viewBox="0 0 100 40" preserveAspectRatio="none" className="line__string">
      <path d={`M0 6 Q50 ${6 + SAG * 2} 100 6`} fill="none" stroke="oklch(80% 0.04 60 / 0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
    <ul className="line__prints">
      {prints.map((p, i) => {
        const t = (i + 0.5) / PER_LINE;
        const drop = 4 * SAG * t * (1 - t);
        return (
          <li key={p.key} className="line__print" style={{ "--drop": `${drop.toFixed(1)}px`, "--sway": `${((i * 0.7) % 3).toFixed(1)}s`, "--tilt": `${((i * 37) % 7) - 3}deg` } as CSSProperties}>
            <span aria-hidden className="line__pin" />
            <span className="line__paper">
              <span className="line__photo">{p.node}</span>
              {p.caption && <span className="line__caption">{p.caption}</span>}
            </span>
          </li>
        );
      })}
    </ul>
    </div>
  </div>
);
