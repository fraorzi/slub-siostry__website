import type { CSSProperties } from "react";

/** Sosna zwyczajna: wysoki, rudy pień i płaska, kłębiasta korona na samej górze. */
const Pine = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 130 320" className="hall__tree-art">
    <g transform={flip ? "translate(130 0) scale(-1 1)" : undefined}>
      <path d="M59 320 L69 320 L66 150 Q64 110 66 72 L62 72 Q60 112 61 150 Z" fill="oklch(54% 0.085 45)" />
      <path d="M64 130 L40 96 M65 112 L92 84 M63 92 L50 60" stroke="oklch(42% 0.06 45)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <g fill="oklch(36% 0.055 155)">
        <ellipse cx="40" cy="88" rx="30" ry="15" />
        <ellipse cx="90" cy="76" rx="32" ry="17" />
        <ellipse cx="58" cy="50" rx="34" ry="19" />
        <ellipse cx="24" cy="110" rx="18" ry="9" />
      </g>
      <g fill="oklch(46% 0.07 145)">
        <ellipse cx="46" cy="80" rx="20" ry="8" />
        <ellipse cx="94" cy="68" rx="20" ry="9" />
        <ellipse cx="62" cy="40" rx="22" ry="10" />
      </g>
    </g>
  </svg>
);

/** Brzoza: biały pień w czarne kreski i lekka, zwisająca korona w jasnej zieleni. */
const Birch = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 110 260" className="hall__tree-art">
    <g transform={flip ? "translate(110 0) scale(-1 1)" : undefined}>
      <path d="M51 260 L60 260 L58 70 Q57 50 56 40 L54 40 Q54 60 53 90 Z" fill="oklch(96% 0.006 100)" />
      <g fill="oklch(25% 0.01 100)">
        <rect x="52" y="220" width="6" height="2" /><rect x="54" y="196" width="5" height="2" />
        <rect x="52" y="168" width="5" height="1.6" /><rect x="54" y="140" width="4" height="1.6" />
        <rect x="53" y="112" width="4" height="1.4" />
      </g>
      <g fill="oklch(70% 0.11 128)" opacity="0.92">
        <ellipse cx="55" cy="72" rx="36" ry="42" />
        <ellipse cx="30" cy="104" rx="22" ry="32" />
        <ellipse cx="82" cy="108" rx="22" ry="34" />
      </g>
      <g fill="oklch(80% 0.1 120)" opacity="0.75">
        <ellipse cx="50" cy="56" rx="20" ry="22" />
        <ellipse cx="78" cy="94" rx="10" ry="18" />
      </g>
    </g>
  </svg>
);

export type Tree = { kind: "pine" | "birch"; x: number; y: number; s?: number; flip?: boolean };

/** Drzewo w ogrodzie wokół sali: zawsze zwrócone do kamery, jak świeca na stole. */
export const HallTree = ({ kind, x, y, s = 1, flip }: Tree) => (
  <span className={`hall__tree hall__tree--${kind}`} style={{ left: x, top: y, "--s": s } as CSSProperties}>
    {kind === "pine" ? <Pine flip={flip} /> : <Birch flip={flip} />}
  </span>
);
