import "server-only";
import { cookies } from "next/headers";
import { DESIGN_COOKIE, defaultDesign, parseDesign, type Design } from "./catalog";

/** Panel projektu: zawsze w dev, na produkcji tylko z DESIGN_LAB=1. */
export const labEnabled = () => process.env.NODE_ENV !== "production" || process.env.DESIGN_LAB === "1";

export async function readDesign(): Promise<Design> {
  if (!labEnabled()) return defaultDesign;
  return parseDesign((await cookies()).get(DESIGN_COOKIE)?.value);
}
