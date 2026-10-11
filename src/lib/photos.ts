import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), ".uploads");
export const MAX_BYTES = 25 * 1024 * 1024;

const EXT_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
} as const;
type PhotoType = keyof typeof EXT_BY_TYPE;
const TYPE_BY_EXT = Object.fromEntries(Object.entries(EXT_BY_TYPE).map(([t, e]) => [e, t])) as Record<string, PhotoType>;

const NAME = /^[0-9]{13}-[0-9a-f-]{36}\.(jpg|png|webp|heic|heif)$/;

export type Photo = { name: string; url: string };

const toPhoto = (name: string): Photo => ({ name, url: `/api/photos/${name}` });

export const isPhotoType = (type: string): type is PhotoType => type in EXT_BY_TYPE;

export async function savePhoto(file: File): Promise<Photo> {
  if (!isPhotoType(file.type)) throw new Error(`Nieobsługiwany format: ${file.type || "nieznany"}`);
  if (file.size > MAX_BYTES) throw new Error("Plik jest większy niż 25 MB");
  await mkdir(DIR, { recursive: true });
  const name = `${Date.now()}-${randomUUID()}.${EXT_BY_TYPE[file.type]}`;
  await writeFile(path.join(DIR, name), Buffer.from(await file.arrayBuffer()));
  return toPhoto(name);
}

export async function listPhotos(): Promise<Photo[]> {
  const names = await readdir(DIR).catch(() => [] as string[]);
  return names.filter((n) => NAME.test(n)).sort().reverse().map(toPhoto);
}

export async function readPhoto(name: string): Promise<{ body: Buffer; type: PhotoType } | null> {
  if (!NAME.test(name)) return null;
  const file = path.join(DIR, name);
  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) return null;
  return { body: await readFile(file), type: TYPE_BY_EXT[name.split(".").pop()!] };
}
