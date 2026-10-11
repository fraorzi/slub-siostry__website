export const ACCESS_COOKIE = "wesele_klucz";
export const ACCESS_PARAM = "k";

export function hasAccess(value: string | undefined): boolean {
  const key = process.env.SITE_KEY;
  if (!key) return true;
  return value === key;
}
