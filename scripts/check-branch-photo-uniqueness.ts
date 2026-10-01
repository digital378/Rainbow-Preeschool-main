import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { branchPhotos, photoPageOwners, playSchoolNearMePhotos } from "../shared/branch-photos";

const publicRoot = path.resolve(process.cwd(), "client/public");
// A 64-bit DCT perceptual hash tolerates resizing, re-encoding and small colour
// changes. Eight differing bits catches near-identical photos without treating
// every classroom or play-area photo as the same image.
const MAX_PHASH_DISTANCE = 8;

interface CheckedPhoto {
  page: string;
  section: string;
  src: string;
  hash: bigint;
}

async function perceptualHash(filePath: string): Promise<bigint> {
  const { data: pixels } = await sharp(filePath)
    .resize(32, 32, { fit: "fill" })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const coefficients: number[] = [];
  // The top-left 8×8 coefficients from the two-dimensional DCT form the
  // standard 64-bit pHash; include the DC coefficient in the median.
  for (let v = 0; v < 8; v++) {
    for (let u = 0; u < 8; u++) {
      let coefficient = 0;
      for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 32; x++) {
          coefficient +=
            pixels[y * 32 + x] *
            Math.cos(((2 * x + 1) * u * Math.PI) / 64) *
            Math.cos(((2 * y + 1) * v * Math.PI) / 64);
        }
      }
      const horizontalScale = u === 0 ? 1 / Math.sqrt(2) : 1;
      const verticalScale = v === 0 ? 1 / Math.sqrt(2) : 1;
      coefficients.push((coefficient * horizontalScale * verticalScale) / 4);
    }
  }

  const sortedCoefficients = [...coefficients].sort((first, second) => first - second);
  const median = (sortedCoefficients[31] + sortedCoefficients[32]) / 2;
  let hash = 0n;
  for (const coefficient of coefficients) {
    hash = (hash << 1n) | BigInt(coefficient > median);
  }
  return hash;
}

function hammingDistance(first: bigint, second: bigint): number {
  let bits = first ^ second;
  let distance = 0;
  while (bits !== 0n) {
    bits &= bits - 1n;
    distance++;
  }
  return distance;
}

function srcSetPaths(srcSet?: string): string[] {
  return srcSet
    ? srcSet
        .split(",")
        .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
        .filter(Boolean)
    : [];
}

function imagePath(src: string, page: string, section: string, errors: string[]): string | undefined {
  const filePath = path.resolve(publicRoot, src.replace(/^\/+/, ""));
  if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
    errors.push(`${page} ${section}: image path escapes client/public: ${src}`);
    return undefined;
  }
  if (!existsSync(filePath)) {
    errors.push(`${page} ${section}: missing image ${src}`);
    return undefined;
  }
  return filePath;
}

async function main() {
  const checked: CheckedPhoto[] = [];
  const errors: string[] = [];

  for (const [branch, photos] of Object.entries(branchPhotos)) {
    const referencedPhotos = [
      ...("hero" in photos ? [{ section: "hero", ...photos.hero }] : []),
      ...("about" in photos ? [{ section: "about", ...photos.about }] : []),
      ...photos.gallery.map((photo, index) => ({
        section: `gallery[${index}]`,
        ...photo,
      })),
    ];

    for (const photo of referencedPhotos) {
      const filePath = imagePath(photo.src, branch, photo.section, errors);
      if (!filePath) continue;

      try {
        const hash = await perceptualHash(filePath);
        for (const previous of checked) {
          const distance = hammingDistance(hash, previous.hash);
          if (distance <= MAX_PHASH_DISTANCE) {
            const scope = previous.page === branch ? `within ${branch}` : `across ${previous.page} and ${branch}`;
            errors.push(
              `${branch} ${photo.section} (${photo.src}) matches ${previous.page} ${previous.section} (${previous.src}) ` +
              `${scope}: perceptual pHash distance ${distance}/64 (threshold ≤${MAX_PHASH_DISTANCE})`,
            );
          }
        }
        checked.push({ page: branch, section: photo.section, src: photo.src, hash });
      } catch (error) {
        errors.push(`${branch} ${photo.section}: cannot decode photo ${photo.src}: ${String(error)}`);
      }
    }
  }

  const hubPhotos = [
    { section: "hero", ...playSchoolNearMePhotos.hero },
    { section: "about", ...playSchoolNearMePhotos.about },
    ...Object.entries(playSchoolNearMePhotos.centres)
      .filter(([, photo]) => photo.kind === "photo")
      .map(([slug, photo]) => ({ section: `centres.${slug}`, ...photo })),
  ];

  for (const photo of hubPhotos) {
    const filePath = imagePath(photo.src, "/play-school-near-me", photo.section, errors);
    if (!filePath) continue;
    try {
      const hash = await perceptualHash(filePath);
      for (const previous of checked) {
        const distance = hammingDistance(hash, previous.hash);
        if (distance <= MAX_PHASH_DISTANCE) {
          errors.push(
            `/play-school-near-me ${photo.section} (${photo.src}) matches ${previous.page} ${previous.section} ` +
              `(${previous.src}): perceptual pHash distance ${distance}/64 (threshold ≤${MAX_PHASH_DISTANCE})`,
          );
        }
      }
      checked.push({ page: "/play-school-near-me", section: photo.section, src: photo.src, hash });
    } catch (error) {
      errors.push(`/play-school-near-me ${photo.section}: cannot decode photo ${photo.src}: ${String(error)}`);
    }
  }

  for (const [slug, photo] of Object.entries(playSchoolNearMePhotos.centres)) {
    const filePath = imagePath(photo.src, "/play-school-near-me", `centres.${slug}`, errors);
    if (photo.kind === "illustration") {
      // Illustrations are intentionally outside the photo-uniqueness comparison.
      if (!photo.src.toLowerCase().endsWith(".svg")) {
        errors.push(`/play-school-near-me centres.${slug}: illustration must be an SVG: ${photo.src}`);
      }
    } else if (photo.kind !== "photo") {
      errors.push(`/play-school-near-me centres.${slug}: unknown image kind`);
    }
    if (photo.kind === "photo" && filePath && !checked.some((item) => item.src === photo.src)) {
      try {
        const hash = await perceptualHash(filePath);
        for (const previous of checked) {
          const distance = hammingDistance(hash, previous.hash);
          if (distance <= MAX_PHASH_DISTANCE) {
            errors.push(
              `/play-school-near-me centres.${slug} (${photo.src}) matches ${previous.page} ${previous.section} ` +
                `(${previous.src}): perceptual pHash distance ${distance}/64 (threshold ≤${MAX_PHASH_DISTANCE})`,
            );
          }
        }
        checked.push({ page: "/play-school-near-me", section: `centres.${slug}`, src: photo.src, hash });
      } catch (error) {
        errors.push(`/play-school-near-me centres.${slug}: cannot decode photo ${photo.src}: ${String(error)}`);
      }
    }
  }

  for (const src of [
    ...srcSetPaths(playSchoolNearMePhotos.hero.srcSet),
    ...srcSetPaths(playSchoolNearMePhotos.hero.avifSrcSet),
    playSchoolNearMePhotos.og.src,
  ]) {
    imagePath(src, "/play-school-near-me", "registered derivative", errors);
  }

  for (const photo of checked) {
    const owner = photoPageOwners[photo.src];
    if (!owner) errors.push(`${photo.page} ${photo.section}: unregistered photo asset ${photo.src}`);
  }

  if (errors.length) {
    console.error("Branch and Play School Near Me photo uniqueness check failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Branch and Play School Near Me photo uniqueness check passed (${checked.length} photographs across ` +
      `${Object.keys(branchPhotos).length} branches and /play-school-near-me; 64-bit DCT pHash, ` +
      `near-duplicate threshold ≤${MAX_PHASH_DISTANCE} differing bits; within and across pages. ` +
      `Centre illustrations and registered hero/OG derivatives are excluded from photograph comparisons.)`,
  );
}

main().catch((error) => {
  console.error("Branch photo uniqueness check failed:", error);
  process.exitCode = 1;
});