export type Stage = "before" | "day" | "after";

const previewParam: Record<string, Stage> = { przed: "before", dzien: "day", po: "after" };

const warsawDate = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(d);
const warsawHour = (d: Date) => Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Warsaw", hour: "2-digit", hourCycle: "h23" }).format(d));

const nextDay = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

export function stageFor(now: Date, weddingDay: string): Stage {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weddingDay)) return "day";
  const today = warsawDate(now);
  if (today < weddingDay) return "before";
  if (today === weddingDay) return "day";
  if (today === nextDay(weddingDay) && warsawHour(now) < 12) return "day";
  return "after";
}

export function previewStage(param: string | string[] | undefined): Stage | null {
  if (process.env.NODE_ENV === "production" || typeof param !== "string") return null;
  return previewParam[param] ?? null;
}
