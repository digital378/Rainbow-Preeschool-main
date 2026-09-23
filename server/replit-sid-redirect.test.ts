import { afterEach, describe, expect, it, vi } from "vitest";
import express from "express";
import { createServer, request as httpRequest } from "node:http";
import type { AddressInfo } from "node:net";
import { setupRedirects } from "./redirects";

async function request(
  path: string,
  host = "www.rainbowpreschools.com",
  method = "GET",
) {
  const app = express();
  setupRedirects(app);
  app.use((_req, res) => res.status(200).send("page"));
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const port = (server.address() as AddressInfo).port;
    return await new Promise<{ status: number; location?: string }>((resolve, reject) => {
      const outgoing = httpRequest({
        hostname: "127.0.0.1",
        port,
        path,
        method,
        headers: { host, "x-forwarded-proto": "https" },
      }, (res) => {
        res.resume();
        res.on("end", () => resolve({
          status: res.statusCode ?? 0,
          location: res.headers.location,
        }));
      });
      outgoing.on("error", reject);
      outgoing.end();
    });
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => error ? reject(error) : resolve()),
    );
  }
}

afterEach(() => vi.unstubAllEnvs());

describe("replit_sid redirects", () => {
  it("redirects public pages to the clean URL, including repeated markers", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(await request("/preschool-readiness-quiz?replit_sid=one&replit_sid=two"))
      .toEqual({ status: 301, location: "/preschool-readiness-quiz" });
    expect(await request("/testimonials?source=school&replit_sid=one&page=2"))
      .toEqual({ status: 301, location: "/testimonials?source=school&page=2" });
    expect(await request("/?replit_sid=one", undefined, "HEAD"))
      .toEqual({ status: 301, location: "/" });
  });

  it("leaves clean URLs, API routes, and non-page methods untouched", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(await request("/testimonials?source=school")).toEqual({ status: 200 });
    expect(await request("/api/blog?replit_sid=one")).toEqual({ status: 200 });
    expect(await request("/testimonials?replit_sid=one", undefined, "POST"))
      .toEqual({ status: 200 });
  });

  it("does not rewrite preview or development URLs", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(await request("/testimonials?replit_sid=one")).toEqual({ status: 200 });
    vi.stubEnv("NODE_ENV", "production");
    expect(await request("/testimonials?replit_sid=one", "example.com"))
      .toEqual({ status: 200 });
  });
});