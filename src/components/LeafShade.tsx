import type { ReactNode } from "react";

// Cień sosen i brzóz z ogrodu Miodowego Zakątka, jak przez przeszklenie sali: tylko za dnia, za treścią.
// Gałęzie liczone raz z ziarna, współrzędne zaokrąglone (identyczny HTML na serwerze i w przeglądarce).

const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Gałąź sosny: pęki igieł wzdłuż lekko wygiętej gałązki. */
function pine(seed: number, length: number) {
  const rand = rng(seed);
  const parts: string[] = [`M0 0 Q${r1(length * 0.5)} ${r1(length * 0.08)} ${length} ${r1(length * 0.2)}`];
  for (let t = 0.08; t < 1; t += 0.045) {
    const x = length * t, y = length * 0.2 * t * t + length * 0.08 * 2 * t * (1 - t);
    const needles = 7 + Math.floor(rand() * 4);
    for (let n = 0; n < needles; n++) {
      const a = -Math.PI * 0.85 + (n / (needles - 1)) * Math.PI * 1.7 + (rand() - 0.5) * 0.25;
      const len = 26 + rand() * 18 - t * 8;
      parts.push(`M${r1(x)} ${r1(y)} l${r1(Math.cos(a) * len + 8)} ${r1(Math.sin(a) * len)}`);
    }
  }
  return parts.join("");
}

/** Zwisająca gałązka brzozy: cienki pęd i drobne, owalne liście na zmianę po obu stronach. */
function birch(seed: number, length: number) {
  const rand = rng(seed);
  const sway = (rand() - 0.5) * length * 0.3;
  const stem = `M0 0 Q${r1(sway)} ${r1(length * 0.5)} ${r1(sway * 0.4)} ${length}`;
  const leaves: string[] = [];
  for (let t = 0.12, side = 1; t < 1; t += 0.07 + rand() * 0.04, side *= -1) {
    const x = 2 * t * (1 - t) * sway + t * t * sway * 0.4, y = length * t;
    const size = 9 + rand() * 6;
    const a = side * (0.6 + rand() * 0.5) + Math.PI / 2;
    const tipX = x + Math.cos(a) * size * 2, tipY = y + Math.sin(a) * size * 2;
    const nx = -Math.sin(a) * size * 0.75, ny = Math.cos(a) * size * 0.75;
    const mx = (x + tipX) / 2, my = (y + tipY) / 2;
    leaves.push(`M${r1(x)} ${r1(y)} Q${r1(mx + nx)} ${r1(my + ny)} ${r1(tipX)} ${r1(tipY)} Q${r1(mx - nx)} ${r1(my - ny)} ${r1(x)} ${r1(y)}Z`);
  }
  return { stem, leaves: leaves.join("") };
}

const PINES = [
  { seed: 7, length: 520, at: "translate(-40 40) rotate(8)" },
  { seed: 19, length: 380, at: "translate(-30 250) rotate(-6)" },
].map((p) => ({ ...p, d: pine(p.seed, p.length) }));

const BIRCHES = Array.from({ length: 9 }, (_, i) => ({
  ...birch(101 + i * 13, 260 + ((i * 97) % 220)),
  at: `translate(${1000 - i * 34 - (i % 3) * 18} ${-20 + (i % 4) * 12})`,
}));

/** Warstwa z własnym SVG: kołysze się cała (transform w kompozytorze), rozmycie liczy się raz. */
const Layer = ({ id, className, children }: { id: string; className: string; children: ReactNode }) => (
  <div className={`leaf-shade__layer ${className}`}>
    <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMin slice">
      <filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.2" /></filter>
      <g filter={`url(#${id})`}>{children}</g>
    </svg>
  </div>
);

export function LeafShade() {
  return (
    <div aria-hidden className="leaf-shade">
      <Layer id="leaf-blur-pine" className="leaf-shade__pine">
        {PINES.map((p) => <path key={p.seed} d={p.d} transform={p.at} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />)}
      </Layer>
      <Layer id="leaf-blur-birch" className="leaf-shade__birch">
        {BIRCHES.map((b) => (
          <g key={b.at} transform={b.at}>
            <path d={b.stem} fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d={b.leaves} fill="currentColor" />
          </g>
        ))}
      </Layer>
    </div>
  );
}
