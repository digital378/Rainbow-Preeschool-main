import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { branchPhotos } from "../shared/branch-photos";

const publicRoot = path.resolve(process.cwd(), "client/public");
const seenHashes = new Map<string, string>();
const errors: string[] = [];

for (const [branch, photos] of Object.entries(branchPhotos)) {
  const referencedPhotos = [
    { section: "hero", ...photos.hero },
    { section: "about", ...photos.about },
    ...photos.gallery.map((photo, index) => ({
      section: `gallery[${index}]`,
      ...photo,
    })),
  ];

  const seenInBranch = new Set<string>();
  for (const photo of referencedPhotos) {
    const relativePath = photo.src.replace(/^\/+/, "");
    const filePath = path.resolve(publicRoot, relativePath);
    if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
      errors.push(`${branch} ${photo.section}: photo path escapes client/public: ${photo.src}`);
      continue;
    }
    if (!existsSync(filePath)) {
      errors.push(`${branch} ${photo.section}: missing photo ${photo.src}`);
      continue;
    }

    const hash = createHash("sha256").update(readFileSync(filePath)).digest("hex");
    const previous = seenHashes.get(hash);
    if (previous) {
      errors.push(`${branch} ${photo.section}: duplicate photo content matches ${previous} (${photo.src})`);
    } else {
      seenHashes.set(hash, `${branch} ${photo.section} (${photo.src})`);
    }

    if (seenInBranch.has(hash)) {
      errors.push(`${branch} ${photo.section}: duplicate photo content within ${branch} (${photo.src})`);
    }
    seenInBranch.add(hash);
  }
}

if (errors.length) {
  console.error("Branch photo uniqueness check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Branch photo uniqueness check passed (${seenHashes.size} unique photo files).`);