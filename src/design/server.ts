import "server-only";
import { cookies } from "next/headers";
import { DESIGN_COOKIE, defaultDesign, parseDesign, type Design } from "./catalog";

/** Panel projektu: w dev, na podglądach Vercela (każdy branch poza produkcją) albo z DESIGN_LAB=1. Na produkcji goście go nie widzą. */
export const labEnabled = () => process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview" || process.env.DESIGN_LAB === "1";

export async function readDesign(): Promise<Design> {
  if (!labEnabled()) return defaultDesign;
  return parseDesign((await cookies()).get(DESIGN_COOKIE)?.value);
}
