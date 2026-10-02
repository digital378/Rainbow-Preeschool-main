import { spawn } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readdir, rm, symlink } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

// A workspace smoke test can hide missing production dependencies. Copy the
// executable outside the repository so Node cannot resolve workspace packages.
// Only static asset directories are linked back; the executable is a real copy.
const workspace = process.cwd();
const isolated = await mkdtemp(join(tmpdir(), "rainbow-runtime-"));
let child;
let output = "";

async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const port = server.address().port;
  await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  return port;
}

try {
  const dist = join(isolated, "dist");
  await mkdir(dist);
  for (const name of await readdir(resolve(workspace, "dist"))) {
    const source = resolve(workspace, "dist", name);
    if (name === "index.cjs") {
      await copyFile(source, join(dist, name));
    } else {
      await symlink(source, join(dist, name));
    }
  }
  for (const name of ["public", "client"]) {
    await symlink(resolve(workspace, name), join(isolated, name));
  }

  const port = await freePort();
  child = spawn(process.execPath, ["dist/index.cjs"], {
    cwd: isolated,
    env: { ...process.env, NODE_ENV: "production", NODE_PATH: "", PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let spawnError;
  child.once("error", (err) => { spawnError = err; });
  for (const stream of [child.stdout, child.stderr]) {
    stream.on("data", (chunk) => { output = (output + chunk).slice(-16000); });
  }
  const origin = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30000;
  let ready = false;
  while (Date.now() < deadline) {
    if (spawnError) throw spawnError;
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(`Isolated production server exited before becoming ready (${child.exitCode ?? child.signalCode})`);
    }
    try {
      const response = await fetch(`${origin}/`, {
        headers: { "User-Agent": "GoogleHC/1.0" },
        signal: AbortSignal.timeout(2000),
        redirect: "manual",
      });
      await response.text();
      if (response.status === 200) {
        ready = true;
        break;
      }
    } catch {
      // The listener may not have bound yet; retry until the startup deadline.
    }
    await delay(100);
  }
  if (!ready) throw new Error("Isolated production health check did not return HTTP 200");

  // Exercise the React server renderer, not just the static homepage.
  for (const path of ["/", "/pre-kg-age-guide"]) {
    for (const userAgent of ["Mozilla/5.0", "Googlebot"]) {
      const response = await fetch(`${origin}${path}`, {
        headers: { "User-Agent": userAgent },
        signal: AbortSignal.timeout(10000),
        redirect: "manual",
      });
      const html = await response.text();
      if (response.status !== 200 || !/<h1\b/i.test(html)) {
        throw new Error(`${path} (${userAgent}) did not return a rendered HTML page: HTTP ${response.status}`);
      }
      console.log(`[production-runtime] ${path} (${userAgent}): HTTP 200, rendered H1`);
    }
  }
  console.log("[production-runtime] PASS — production server runs outside the workspace without its node_modules");
} catch (err) {
  console.error(`[production-runtime] FAIL — ${err.message}`);
  console.error(output);
  process.exitCode = 1;
} finally {
  if (child && child.exitCode === null && child.signalCode === null) {
    const exited = new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGTERM");
    const stopped = await Promise.race([exited.then(() => true), delay(3000).then(() => false)]);
    if (!stopped) {
      child.kill("SIGKILL");
      await exited;
    }
  }
  await rm(isolated, { recursive: true, force: true });
}