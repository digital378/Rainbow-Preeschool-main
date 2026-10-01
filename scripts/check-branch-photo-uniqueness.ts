import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { branchPhotos } from "../shared/branch-photos";

const publicRoot = path.resolve(process.cwd(), "client/public");
// A 64-bit difference hash tolerates resizing, re-encoding and small colour
// changes. Eight differing bits catches near-identical photos without treating
// every classroom or play-area photo as the same image.
const MAX_DHASH_DISTANCE = 8;

interface CheckedPhoto {
  branch: string;
  section: string;
  src: string;
  hash: bigint;
}

async function differenceHash(filePath: string): Promise<bigint> {
  const pixels = await sharp(filePath)
    .resize(9, 8, { fit: "fill" })
    .grayscale()
    .raw()
    .toBuffer();
  let hash = 0n;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      hash = (hash << 1n) | BigInt(pixels[row * 9 + col] > pixels[row * 9 + col + 1]);
    }
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
      const filePath = path.resolve(publicRoot, photo.src.replace(/^\/+/, ""));
      if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
        errors.push(`${branch} ${photo.section}: photo path escapes client/public: ${photo.src}`);
        continue;
      }
      if (!existsSync(filePath)) {
        errors.push(`${branch} ${photo.section}: missing photo ${photo.src}`);
        continue;
      }

      try {
        const hash = await differenceHash(filePath);
        for (const previous of checked) {
          const distance = hammingDistance(hash, previous.hash);
          if (distance <= MAX_DHASH_DISTANCE) {
            const scope = previous.branch === branch ? `within ${branch}` : `across ${previous.branch} and ${branch}`;
            errors.push(
              `${branch} ${photo.section} (${photo.src}) matches ${previous.branch} ${previous.section} (${previous.src}) ` +
              `${scope}: perceptual dHash distance ${distance}/64 (threshold ≤${MAX_DHASH_DISTANCE})`,
            );
          }
        }
        checked.push({ branch, section: photo.section, src: photo.src, hash });
      } catch (error) {
        errors.push(`${branch} ${photo.section}: cannot decode photo ${photo.src}: ${String(error)}`);
      }
    }
  }

  if (errors.length) {
    console.error("Branch photo uniqueness check failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Branch photo uniqueness check passed (${checked.length} photos across ${Object.keys(branchPhotos).length} branches; ` +
    `64-bit perceptual dHash, near-duplicate threshold ≤${MAX_DHASH_DISTANCE} differing bits; within and across pages).`,
  );
}

main().catch((error) => {
  console.error("Branch photo uniqueness check failed:", error);
  process.exitCode = 1;
});