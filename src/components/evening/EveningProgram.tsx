import { wedding } from "@/content/wedding";

const programme = () => [
  { time: wedding.ceremony.time, label: "Ślub" },
  { time: wedding.reception.time, label: "Przyjęcie" },
  { time: "17:00", label: "Siadamy do stołów" },
  { time: "19:30", label: "Złota godzina" },
  ...wedding.evening,
  { time: "00:00", label: "Północ" },
  { time: "04:00", label: "Ostatnia piosenka" },
];

/** Karta programu dnia jak menu na stole: kropkowane prowadnice, godziny ze złotej folii. */
export function EveningProgram() {
  const items = programme();
  const now = new Set(wedding.evening.map((e) => e.time));
  return (
    <section id="h21" data-time={wedding.evening[0].time} data-theme="champagne" className="relative px-gutter py-[clamp(6rem,18vh,10rem)]">
      <div data-fly="left" className="paper relative mx-auto max-w-[34rem] rounded-[3px] px-[clamp(1.75rem,6vw,4rem)] py-[clamp(3rem,8vw,5rem)] text-center shadow-[0_1px_2px_oklch(30%_0.02_70/0.15),0_50px_90px_-40px_oklch(25%_0.03_70/0.55)]">
        <p className="font-label text-[0.75rem] uppercase tracking-[0.32em] text-ink-soft">Program</p>
        <p className="mt-3 font-serif text-[clamp(2.4rem,6vw,3.4rem)] italic leading-none">{wedding.bride} &amp; {wedding.groom}</p>
        <span aria-hidden className="foil-bg mx-auto mt-6 block h-px w-12" />
        <ol className="mt-10 grid gap-4 text-left">
          {items.map((e) => (
            <li key={`${e.time}-${e.label}`} className={`flex items-baseline gap-3 ${now.has(e.time) ? "" : "opacity-55"}`}>
              <span className={`font-serif text-[1.5rem] leading-none lining-nums ${now.has(e.time) ? "foil" : ""}`}>{e.time}</span>
              <span aria-hidden className="mb-[0.3em] flex-1 border-b border-dotted border-[oklch(70%_0.03_80)]" />
              <span className={`text-right font-serif leading-tight ${now.has(e.time) ? "text-[1.5rem]" : "text-[1.2rem]"}`}>{e.label}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 font-hand text-[1.5rem] text-ink-soft">godziny jeszcze mogą się przesunąć</p>
      </div>
    </section>
  );
}
