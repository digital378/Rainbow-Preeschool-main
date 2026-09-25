import { copyFile, mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Refresh the homepage's local poster snapshot before a release:
// node scripts/snapshot-instagram-reel-posters.mjs http://127.0.0.1:5000
// The generated manifest contains only IDs, captions, permalinks, and local poster paths.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicPosterDir = path.join(projectRoot, "client/public/instagram-reels");
const posterModule = path.join(projectRoot, "client/src/components/rainbow-theatre/local-reel-posters.ts");
const baseUrl = process.argv[2] || "http://127.0.0.1:5000";
const apiUrl = new URL("/api/instagram/reels", baseUrl);
const maxImageBytes = 8 * 1024 * 1024;
const extensionForType = new Map([
  ["image/avif", "avif"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function isInstagramHost(hostname) {
  const host = hostname.toLowerCase();
  return host === "instagram.com" ||
    host.endsWith(".instagram.com") ||
    host === "cdninstagram.com" ||
    host.endsWith(".cdninstagram.com") ||
    host === "fbcdn.net" ||
    host.endsWith(".fbcdn.net");
}

function isImageData(bytes, type) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/webp") return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (type === "image/avif") return bytes.toString("ascii", 4, 12).includes("ftypavif");
  return false;
}

function cleanPoster(reel, posterPath) {
  if (typeof reel.id !== "string" || !/^[A-Za-z0-9_-]+$/.test(reel.id)) {
    throw new Error("The current Instagram feed contains an invalid reel ID.");
  }
  if (typeof reel.permalink !== "string") {
    throw new Error(`Reel ${reel.id} has no Instagram permalink; snapshot stopped.`);
  }
  let permalink;
  try {
    permalink = new URL(reel.permalink);
  } catch {
    throw new Error(`Reel ${reel.id} has an invalid Instagram permalink; snapshot stopped.`);
  }
  if (permalink.protocol !== "https:" || !isInstagramHost(permalink.hostname)) {
    throw new Error(`Reel ${reel.id} has a non-Instagram permalink; snapshot stopped.`);
  }
  permalink.search = "";
  permalink.hash = "";
  return {
    id: reel.id,
    caption: typeof reel.caption === "string" ? reel.caption : "",
    permalink: permalink.toString(),
    posterPath,
  };
}

async function downloadPoster(reel, index, stagingDir) {
  if (typeof reel.thumbnailUrl !== "string") {
    throw new Error(`Reel ${index + 1} has no authentic thumbnail; snapshot stopped.`);
  }
  let thumbnailUrl;
  try {
    thumbnailUrl = new URL(reel.thumbnailUrl);
  } catch {
    throw new Error(`Reel ${index + 1} has an invalid authentic thumbnail URL; snapshot stopped.`);
  }
  if (thumbnailUrl.protocol !== "https:" || !isInstagramHost(thumbnailUrl.hostname)) {
    throw new Error(`Reel ${index + 1} thumbnail is not hosted by Instagram; snapshot stopped.`);
  }

  let response;
  try {
    response = await fetch(thumbnailUrl, { signal: AbortSignal.timeout(20000) });
  } catch {
    throw new Error(`Authentic thumbnail download failed for reel ${index + 1}.`);
  }
  if (!response.ok) {
    throw new Error(`Authentic thumbnail download failed for reel ${index + 1} (HTTP ${response.status}).`);
  }

  let finalUrl;
  try {
    finalUrl = new URL(response.url);
  } catch {
    throw new Error(`Reel ${index + 1} thumbnail redirect was invalid.`);
  }
  if (finalUrl.protocol !== "https:" || !isInstagramHost(finalUrl.hostname)) {
    throw new Error(`Reel ${index + 1} thumbnail redirected outside Instagram.`);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() || "";
  const extension = extensionForType.get(contentType);
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (!extension || (declaredLength > 0 && declaredLength > maxImageBytes)) {
    throw new Error(`Reel ${index + 1} thumbnail has an unsupported image format or size.`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length || bytes.length > maxImageBytes || !isImageData(bytes, contentType)) {
    throw new Error(`Reel ${index + 1} thumbnail is not a valid supported image.`);
  }

  const filename = `poster-${String(index + 1).padStart(3, "0")}.${extension}`;
  await writeFile(path.join(stagingDir, filename), bytes, { flag: "wx" });
  return cleanPoster(reel, `/instagram-reels/${filename}`);
}

const stagingDir = await mkdtemp(path.join(os.tmpdir(), "rainbow-instagram-posters-"));
try {
  let feedResponse;
  try {
    feedResponse = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) });
  } catch {
    throw new Error("The local Instagram feed endpoint could not be reached.");
  }
  if (!feedResponse.ok) {
    throw new Error(`The local Instagram feed endpoint returned HTTP ${feedResponse.status}.`);
  }

  const payload = await feedResponse.json();
  if (!payload || !Array.isArray(payload.reels) || payload.reels.length === 0) {
    throw new Error("The local Instagram feed returned no reels; no snapshot was written.");
  }

  const snapshot = [];
  for (let start = 0; start < payload.reels.length; start += 6) {
    const batch = payload.reels.slice(start, start + 6);
    snapshot.push(...await Promise.all(
      batch.map((reel, offset) => downloadPoster(reel, start + offset, stagingDir)),
    ));
  }
  if (new Set(snapshot.map((reel) => reel.id)).size !== snapshot.length) {
    throw new Error("The local Instagram feed contained duplicate reel IDs; no snapshot was written.");
  }

  const moduleContents = [
    "export type LocalReelPoster = {",
    "  id: string;",
    "  caption: string;",
    "  permalink: string;",
    "  posterPath: string;",
    "};",
    "",
    "export const LOCAL_REEL_POSTERS: readonly LocalReelPoster[] = ",
    `${JSON.stringify(snapshot, null, 2)};`,
    "",
  ].join("\n");

  await mkdir(publicPosterDir, { recursive: true });
  for (let start = 0; start < snapshot.length; start += 6) {
    await Promise.all(snapshot.slice(start, start + 6).map(async (reel) => {
      const filename = path.basename(reel.posterPath);
      await copyFile(path.join(stagingDir, filename), path.join(publicPosterDir, filename));
    }));
  }
  await writeFile(posterModule, moduleContents);

  const activeFiles = new Set(snapshot.map((reel) => path.basename(reel.posterPath)));
  const existingFiles = await readdir(publicPosterDir);
  await Promise.all(existingFiles
    .filter((filename) => /^poster-\d{3}\.(?:avif|jpg|png|webp)$/.test(filename) && !activeFiles.has(filename))
    .map((filename) => rm(path.join(publicPosterDir, filename), { force: true })));
  console.log(`Saved ${snapshot.length} authentic local reel posters.`);
} finally {
  await rm(stagingDir, { recursive: true, force: true });
}