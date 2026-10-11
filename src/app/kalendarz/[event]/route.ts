import { findEvent, hasWeddingDay, toIcs } from "@/lib/calendar";

export async function GET(_: Request, ctx: RouteContext<"/kalendarz/[event]">) {
  const event = findEvent((await ctx.params).event);
  if (!event || !hasWeddingDay()) return new Response(null, { status: 404 });
  return new Response(toIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
