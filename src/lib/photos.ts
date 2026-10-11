import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), ".uploads");
export const MAX_BYTES = 25 * 1024 * 1024;
const THUMB_PX = 960;

const EXT_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
} as const;
type PhotoType = keyof typeof EXT_BY_TYPE;
const TYPE_BY_EXT = Object.fromEntries(Object.entries(EXT_BY_TYPE).map(([t, e]) => [e, t])) as Record<string, PhotoType>;

const ID = "[0-9]{13}-[0-9a-f-]{36}";
const NAME = new RegExp(`^${ID}\\.(jpg|png|webp|heic|heif)$`);
const THUMB = new RegExp(`^${ID}\\.thumb\\.webp$`);

/** `url` to oryginał (do pobrania), `thumb` lekka miniatura do albumu (gdy udało się ją zrobić). */
export type Photo = { name: string; url: string; thumb?: string };

const thumbName = (name: string) => name.replace(/\.[a-z]+$/, ".thumb.webp");
const toPhoto = (name: string, hasThumb: boolean): Photo => ({ name, url: `/api/photos/${name}`, ...(hasThumb && { thumb: `/api/photos/${thumbName(name)}` }) });

export const isPhotoType = (type: string): type is PhotoType => type in EXT_BY_TYPE;

/** Zdjęcie z telefonu waży 3–8 MB; do albumu robimy miniaturę ~150 KB. HEIC bez kodeka HEVC zostaje bez miniatury. */
async function makeThumb(body: Buffer, name: string): Promise<boolean> {
  try {
    const sharp = (await import("sharp")).default;
    await sharp(body).rotate().resize(THUMB_PX, THUMB_PX, { fit: "inside", withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(DIR, thumbName(name)));
    return true;
  } catch {
    return false;
  }
}

export async function savePhoto(file: File): Promise<Photo> {
  if (!isPhotoType(file.type)) throw new Error(`Nieobsługiwany format: ${file.type || "nieznany"}`);
  if (file.size > MAX_BYTES) throw new Error("Plik jest większy niż 25 MB");
  await mkdir(DIR, { recursive: true });
  const name = `${Date.now()}-${randomUUID()}.${EXT_BY_TYPE[file.type]}`;
  const body = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(DIR, name), body);
  return toPhoto(name, await makeThumb(body, name));
}

export async function listPhotos(): Promise<Photo[]> {
  const names = await readdir(DIR).catch(() => [] as string[]);
  const thumbs = new Set(names.filter((n) => THUMB.test(n)));
  return names.filter((n) => NAME.test(n)).sort().reverse().map((n) => toPhoto(n, thumbs.has(thumbName(n))));
}

export async function readPhoto(name: string): Promise<{ body: Buffer; type: string } | null> {
  const thumb = THUMB.test(name);
  if (!thumb && !NAME.test(name)) return null;
  const file = path.join(DIR, name);
  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) return null;
  return { body: await readFile(file), type: thumb ? "image/webp" : TYPE_BY_EXT[name.split(".").pop()!] };
}
