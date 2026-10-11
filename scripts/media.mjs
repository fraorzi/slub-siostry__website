#!/usr/bin/env node
// Pobiera media z scripts/media-sources.json, kompresuje je i zapisuje w public/media.
// Wideo: 720p na telefon i 1080p na komputer (H.264, bez dźwięku, faststart) + klatka startowa jako plakat.
// Zdjęcia: JPEG do 2400 px, resztę (AVIF/WebP, rozmiary) robi next/image.
// Wymaga ffmpeg. Użycie: pnpm media [klucz…]
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public/media");
const tmp = path.join(root, ".media-cache");
const sources = JSON.parse(await readFile(process.env.MEDIA_SOURCES ?? path.join(import.meta.dirname, "media-sources.json"), "utf8"));
const only = process.argv.slice(2);

const ffmpeg = (...args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

async function download(url, file) {
  if (existsSync(file)) return file;
  if (!/^https?:/.test(url)) {
    await writeFile(file, await readFile(path.resolve(root, url)));
    return file;
  }
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

async function hashed(key, suffix, ext, render) {
  const draft = path.join(tmp, `${key}-${suffix}.${ext}`);
  render(draft);
  const hash = createHash("sha256").update(await readFile(draft)).digest("hex").slice(0, 8);
  const name = `${key}-${suffix}.${hash}.${ext}`;
  await writeFile(path.join(out, name), await readFile(draft));
  return `/media/${name}`;
}

const shortSide = (px) => `scale='if(gt(iw,ih),-2,min(${px},iw))':'if(gt(iw,ih),min(${px},ih),-2)'`;
const h264 = (crf) => ["-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-profile:v", "high", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart"];

await mkdir(out, { recursive: true });
await mkdir(tmp, { recursive: true });

const result = {};
for (const [key, src] of Object.entries(sources)) {
  if (only.length && !only.includes(key)) continue;
  console.log(`→ ${key}`);
  const ext = src.kind === "video" ? "mp4" : "jpg";
  const original = await download(src.url, path.join(tmp, `${key}.source.${ext}`));
  for (const f of await readdir(out)) if (f.startsWith(`${key}-`)) await rm(path.join(out, f));

  if (src.kind === "video") {
    const trim = src.seconds ? ["-t", String(src.seconds)] : [];
    result[key] = {
      mobile: await hashed(key, "720", "mp4", (f) => ffmpeg("-i", original, ...trim, "-vf", shortSide(720), ...h264(28), f)),
      desktop: await hashed(key, "1080", "mp4", (f) => ffmpeg("-i", original, ...trim, "-vf", shortSide(1080), ...h264(25), f)),
      poster: await hashed(key, "poster", "jpg", (f) => ffmpeg("-i", original, "-frames:v", "1", "-vf", shortSide(1080), "-q:v", "4", f)),
    };
  } else {
    result[key] = await hashed(key, "img", "jpg", (f) => ffmpeg("-i", original, "-vf", "scale='min(2400,iw)':-2", "-q:v", "2", f));
  }
}

const file = path.join(root, "src/content/media.ts");
const current = await readFile(file, "utf8");
const previous = Function(`return (${current.slice(current.indexOf("{", current.indexOf("export const media")), current.lastIndexOf("}") + 1)})`)();
const merged = { ...previous, ...result };
await writeFile(
  file,
  `// Plik generuje \`pnpm media\` (scripts/media.mjs). Bez uruchomienia skryptu media idą z Pexels i Unsplash.

export type VideoSource = { mobile: string; desktop: string; poster?: string };

export const media = ${JSON.stringify(merged, null, 2).replace(/"(\w+)":/g, "$1:")} satisfies Record<string, VideoSource | string>;
`,
);
console.log("Gotowe: public/media + src/content/media.ts");
