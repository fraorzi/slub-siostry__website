import { useId } from "react";

const FLOURISH = "M14 62 H92 C104 62 111 55 106 49.5 C101 44.5 93.5 50 97.5 56 C100.5 60.5 108 62 116 62";
const DIAMOND = "M4 62 L9 57 L14 62 L9 67 Z";

/** „&” z ozdobnikami. `tone="ink"` maluje je kolorem tekstu (np. pod maską wideo). */
export function Ampersand({ className = "", tone = "foil" }: { className?: string; tone?: "foil" | "ink" }) {
  const gradient = `amp${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const paint = tone === "foil" ? `url(#${gradient})` : "currentColor";
  return (
    <svg viewBox="0 0 300 124" aria-hidden className={className}>
      {tone === "foil" && (
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" style={{ stopColor: "var(--foil-deep)" }} />
            <stop offset="0.3" style={{ stopColor: "var(--foil-light)" }} />
            <stop offset="0.5" style={{ stopColor: "var(--foil-rich)" }} />
            <stop offset="0.72" style={{ stopColor: "var(--foil-mid)" }} />
            <stop offset="1" style={{ stopColor: "var(--foil-light)" }} />
          </linearGradient>
        </defs>
      )}
      {[false, true].map((mirror) => (
        <g key={String(mirror)} transform={mirror ? "translate(300 0) scale(-1 1)" : undefined}>
          <path className="amp-flourish" d={FLOURISH} fill="none" stroke={paint} strokeWidth="1.4" strokeLinecap="round" pathLength={1} />
          <path className="amp-diamond" d={DIAMOND} fill={paint} />
        </g>
      ))}
      <text
        x="150"
        y="95"
        textAnchor="middle"
        className="amp-glyph"
        fill={paint}
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 104 }}
      >
        &amp;
      </text>
    </svg>
  );
}
