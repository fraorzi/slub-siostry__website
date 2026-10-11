import { wedding } from "@/content/wedding";

export function EveningColumns() {
  return (
    <section id="h21" data-time={wedding.evening[0].time} data-theme="champagne" className="relative px-gutter py-[clamp(6rem,18vh,10rem)]">
      <ol className="grid gap-14 md:grid-cols-2 md:gap-gutter">
        {wedding.evening.map((e) => (
          <li key={e.time} className="relative pt-8">
            <span aria-hidden data-draw className="foil-bg absolute left-0 top-0 h-px w-full origin-left" />
            <p className="foil inline-block font-serif text-[clamp(3rem,7vw,6rem)] leading-none lining-nums">{e.time}</p>
            <p className="mt-3 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight">{e.label}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
