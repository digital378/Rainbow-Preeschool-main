/**
 * Verify the Theatre's locally hosted fallback reels against the built server.
 * Usage: npx --no-install tsx scripts/check-local-reel-media.ts <base-url>
 * Requires ffprobe (provided by replit.nix); never contacts Instagram.
 */
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { resolve } from "node:path";
import { LOCAL_REEL_MEDIA } from "../client/src/components/rainbow-theatre/local-reel-media";

const baseUrl = process.argv[2];
if (!baseUrl || !/^https?:\/\/[^/]+\/?$/.test(baseUrl)) {
  console.error("Usage: tsx scripts/check-local-reel-media.ts <base-url>");
  process.exit(2);
}

type Probe = {
  format?: { format_name?: string; duration?: string };
  streams?: Array<{ codec_type?: string; codec_name?: string }>;
};

const failures: string[] = [];
const media = Object.entries(LOCAL_REEL_MEDIA);
if (media.length === 0) failures.push("LOCAL_REEL_MEDIA is empty");

async function checkFile(id: string, url: string, extension: "mp4" | "webm") {
  const label = `${id} ${extension}`;
  const expectedPrefix = `/instagram-reels/local-${id}.`;
  if (url !== `${expectedPrefix}${extension}`) {
    failures.push(`${label}: unexpected mapped URL ${url}`);
    return;
  }

  const file = resolve("public", url.slice(1));
  let size: number;
  try {
    const stat = statSync(file);
    if (!stat.isFile() || stat.size === 0) throw new Error("not a nonempty regular file");
    size = stat.size;
    const probe: Probe = JSON.parse(execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=format_name,duration:stream=codec_type,codec_name",
      "-of", "json", file,
    ], { encoding: "utf8", timeout: 10_000 }));
    const format = probe.format?.format_name?.split(",") ?? [];
    const codec = extension === "mp4" ? "h264" : "vp9";
    if (!format.includes(extension) ||
        !probe.streams?.some((stream) => stream.codec_type === "video" && stream.codec_name === codec) ||
        !(Number(probe.format?.duration) > 0)) {
      throw new Error(`expected ${extension} container, ${codec} video and positive duration`);
    }
  } catch (error) {
    failures.push(`${label}: file/probe failed: ${String(error)}`);
    return;
  }

  try {
    const response = await fetch(new URL(url, baseUrl), {
      headers: { Range: "bytes=0-1" },
      signal: AbortSignal.timeout(5_000),
    });
    const expectedType = `video/${extension}`;
    const bytes = await response.arrayBuffer();
    if (response.status !== 206 ||
        response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== expectedType ||
        response.headers.get("content-range") !== `bytes 0-1/${size}` ||
        response.headers.get("accept-ranges")?.toLowerCase() !== "bytes" ||
        bytes.byteLength !== 2) {
      failures.push(`${label}: ${url} returned status=${response.status}, type=${response.headers.get("content-type")}, range=${response.headers.get("content-range")}, accept-ranges=${response.headers.get("accept-ranges")}, body=${bytes.byteLength} bytes (expected 206, ${expectedType}, bytes 0-1/${size}, bytes, 2 bytes)`);
    }
  } catch (error) {
    failures.push(`${label}: HTTP Range request failed: ${String(error)}`);
  }
}

for (const [id, mp4Url] of media) {
  if (!/^\d+$/.test(id) || !mp4Url.endsWith(".mp4")) {
    failures.push(`${id}: mapped value must be an MP4 URL`);
    continue;
  }
  await checkFile(id, mp4Url, "mp4");
  await checkFile(id, mp4Url.replace(/\.mp4$/, ".webm"), "webm");
}

if (failures.length) {
  console.error(`FAIL — local reel media (${failures.length} issue(s)):\n${failures.map((message) => `  - ${message}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`PASS — ${media.length} local reels: MP4 + WebM files, video streams, duration, MIME and HTTP byte ranges`);
}