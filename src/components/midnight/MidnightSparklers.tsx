"use client";

import { useEffect, useRef } from "react";
import { HourTime, HourTitle } from "@/components/hour";
import { prefersReducedMotion } from "@/lib/scroll";
import { MIDNIGHT_TITLE } from "./MidnightFilm";

type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number; age: number; kids: boolean };
type Point = { x: number; y: number; t: number };
type Pen = { trail: Point[]; x: number; y: number; on: boolean };

const TRAIL_SECONDS = 2.4;
const MAX_SPARKS = 520;
const GRAVITY = 300;

/**
 * Zimne ognie na canvasie: trzy „automatyczne” ognie powoli kreślą wzory jak na zdjęciu z długim czasem
 * naświetlania, a gość może pisać własnym (mysz albo palec). Rysuje tylko, gdy sekcja jest na ekranie.
 */
export function MidnightSparklers() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = root.current;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!section || !el || !ctx) return;

    const small = window.matchMedia("(max-width: 760px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    let w = 0, h = 0;
    const resize = () => {
      w = section.clientWidth;
      h = section.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const sparks: Spark[] = [];
    const hand: Pen = { trail: [], x: 0, y: 0, on: false };
    let clock = 0;

    // Trzy wolne zimne ognie, każdy po swojej krzywej: nieskończoność na środku, ósemka i owal po bokach.
    const paths = [
      (t: number) => {
        const a = Math.min(w * 0.24, h * 0.32), s = Math.sin(t), c = Math.cos(t), d = 1 + s * s;
        return { x: w * 0.5 + (a * c) / d, y: h * 0.36 + (a * s * c) / d };
      },
      (t: number) => {
        const r = Math.min(w * 0.12, h * 0.16);
        return { x: w * (small ? 0.24 : 0.17) + r * Math.sin(t), y: h * (small ? 0.18 : 0.3) + r * 0.9 * Math.sin(2 * t) };
      },
      (t: number) => {
        const r = Math.min(w * 0.12, h * 0.15);
        return { x: w * (small ? 0.76 : 0.83) + r * Math.cos(t), y: h * (small ? 0.58 : 0.3) + r * 0.6 * Math.sin(t) * (1 + 0.2 * Math.sin(3 * t)) };
      },
    ];
    const autos = paths.map((path, i) => ({ path, phase: i * 2.1, speed: [0.42, 0.36, 0.31][i], pen: { trail: [], x: 0, y: 0, on: true } as Pen }));
    const pens = [...autos.map((a) => a.pen), hand];
    const perPen = small ? 2 : 4;

    const emit = (x: number, y: number, n: number) => {
      for (let i = 0; i < n && sparks.length < MAX_SPARKS; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * (small ? 200 : 260);
        sparks.push({ x, y, px: x, py: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 40, life: 0.25 + Math.random() * 0.5, age: 0, kids: Math.random() < 0.35 });
      }
    };

    const drawTrail = (pen: Pen) => {
      const pts = pen.trail;
      for (let i = 1; i < pts.length; i++) {
        const a = 1 - (clock - pts[i].t) / TRAIL_SECONDS;
        if (a <= 0) continue;
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.strokeStyle = `rgba(255, 196, 110, ${a * 0.22})`;
        ctx.lineWidth = 9;
        ctx.stroke();
        ctx.strokeStyle = `rgba(255, 238, 200, ${a * 0.9})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
    };

    const frame = (dt: number) => {
      clock += dt;
      for (const a of autos) {
        a.phase += dt * a.speed;
        const p = a.path(a.phase);
        a.pen.x = p.x;
        a.pen.y = p.y;
        a.pen.trail.push({ x: p.x, y: p.y, t: clock });
        emit(p.x, p.y, perPen);
      }
      if (hand.on) emit(hand.x, hand.y, perPen + 2);
      for (const pen of pens) while (pen.trail.length && clock - pen.trail[0].t > TRAIL_SECONDS) pen.trail.shift();

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      pens.forEach(drawTrail);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= s.life) {
          if (s.kids) for (let k = 0; k < 3 && sparks.length < MAX_SPARKS; k++) {
            const angle = Math.random() * Math.PI * 2;
            sparks.push({ x: s.x, y: s.y, px: s.x, py: s.y, vx: Math.cos(angle) * 90 + s.vx * 0.2, vy: Math.sin(angle) * 90 + s.vy * 0.2, life: 0.12 + Math.random() * 0.15, age: 0, kids: false });
          }
          sparks.splice(i, 1);
          continue;
        }
        s.px = s.x; s.py = s.y;
        s.vy += GRAVITY * dt;
        s.vx *= 0.985; s.vy *= 0.985;
        s.x += s.vx * dt; s.y += s.vy * dt;
        const k = 1 - s.age / s.life;
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = `rgba(255, ${200 + 55 * k | 0}, ${120 + 120 * k | 0}, ${k})`;
        ctx.lineWidth = 1.1 + k;
        ctx.stroke();
      }
      for (const pen of pens) {
        if (!pen.on) continue;
        const g = ctx.createRadialGradient(pen.x, pen.y, 0, pen.x, pen.y, 26);
        g.addColorStop(0, "rgba(255, 250, 235, 0.95)");
        g.addColorStop(0.25, "rgba(255, 210, 140, 0.45)");
        g.addColorStop(1, "rgba(255, 180, 90, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(pen.x - 26, pen.y - 26, 52, 52);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    if (prefersReducedMotion()) {
      for (const a of autos) for (let t = 0; t < Math.PI * 2; t += 0.02) a.pen.trail.push({ ...a.path(t), t: 0 });
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      autos.forEach((a) => drawTrail(a.pen));
      return;
    }

    let raf = 0, last = 0, visible = false;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      frame(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !document.hidden) start(); else stop(); });
    io.observe(section);
    const onVisibility = () => (document.hidden || !visible ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      hand.x = e.clientX - r.left;
      hand.y = e.clientY - r.top;
      hand.on = true;
      hand.trail.push({ x: hand.x, y: hand.y, t: clock });
    };
    const leave = () => { hand.on = false; };
    const up = (e: PointerEvent) => { if (e.pointerType !== "mouse") leave(); };
    section.addEventListener("pointermove", move);
    section.addEventListener("pointerdown", move);
    section.addEventListener("pointerleave", leave);
    section.addEventListener("pointerup", up);
    section.addEventListener("pointercancel", leave);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerdown", move);
      section.removeEventListener("pointerleave", leave);
      section.removeEventListener("pointerup", up);
      section.removeEventListener("pointercancel", leave);
    };
  }, []);

  return (
    <section ref={root} id="h00" data-time="00:00" data-theme="night" className="relative grid min-h-[110svh] cursor-crosshair touch-pan-y items-end overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,oklch(22%_0.03_60),var(--night)_70%)] px-gutter pb-[clamp(4rem,12vh,7rem)]">
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      <p aria-hidden className="absolute right-gutter top-[clamp(2rem,8vh,4rem)] font-hand text-[1.4rem] text-pearl-soft/70">napisz coś zimnym ogniem</p>
      <div className="pointer-events-none relative">
        <HourTime>00:00</HourTime>
        <HourTitle>{MIDNIGHT_TITLE}</HourTitle>
      </div>
    </section>
  );
}
