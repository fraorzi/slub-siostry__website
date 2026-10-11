import { cookies } from "next/headers";
import { ACCESS_COOKIE, hasAccess } from "@/lib/access";
import { readPhoto } from "@/lib/photos";

export async function GET(_: Request, ctx: RouteContext<"/api/photos/[name]">) {
  if (!hasAccess((await cookies()).get(ACCESS_COOKIE)?.value)) return new Response(null, { status: 401 });
  const photo = await readPhoto((await ctx.params).name);
  if (!photo) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(photo.body), {
    headers: { "Content-Type": photo.type, "Cache-Control": "private, max-age=31536000, immutable" },
  });
}
