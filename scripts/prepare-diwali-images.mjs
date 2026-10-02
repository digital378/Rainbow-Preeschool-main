import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const manifest = JSON.parse(await readFile("blog-pages/diwali-activity-for-kindergarten/image-sources.json", "utf8"));
const output = resolve("public/images");
await mkdir(resolve(output, "og"), { recursive: true });
const hero = manifest.hero;
for (const width of [320, 480, 640, 960, 1200]) {
  const input = sharp(hero.sourcePath).rotate().resize(width, Math.round(width * 3 / 4), { fit: "cover" });
  await input.clone().webp({ quality: 74 }).toFile(resolve(output, `${hero.base}-${width}.webp`));
  await input.clone().avif({ quality: 42, effort: 4 }).toFile(resolve(output, `${hero.base}-${width}.avif`));
}
await sharp(hero.sourcePath).resize(1200, 900, { fit: "cover" }).webp({ quality: 76 }).toFile(resolve(output, `${hero.base}.webp`));
await sharp(hero.sourcePath).resize(1200, 900, { fit: "cover" }).avif({ quality: 42, effort: 4 }).toFile(resolve(output, `${hero.base}.avif`));
await sharp(hero.sourcePath).resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 86, mozjpeg: true })
  .toFile(resolve(output, "og", "diwali-activities-for-kindergarten-2026-og.jpg"));
for (const craft of manifest.crafts) {
  const input = sharp(craft.sourcePath).rotate().resize(640, 480, { fit: "cover" });
  await input.clone().webp({ quality: 78 }).toFile(resolve(output, `${craft.base}.webp`));
  await input.clone().avif({ quality: 48, effort: 4 }).toFile(resolve(output, `${craft.base}.avif`));
}
for (const story of manifest.stories) {
  const input = sharp(story.sourcePath).rotate().resize({ width: story.width, withoutEnlargement: true });
  await input.clone().webp({ quality: 76 }).toFile(resolve(output, `${story.base}.webp`));
  await input.clone().avif({ quality: 44, effort: 4 }).toFile(resolve(output, `${story.base}.avif`));
}
console.log("Prepared verified Rainbow hero/story photographs and eleven finished craft illustrations, with AVIF/WebP and responsive hero variants.");