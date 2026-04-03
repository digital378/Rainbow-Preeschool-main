import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { setupRedirects } from "./redirects";
import { setupBotSSR } from "./bot-ssr";
import { createServer } from "http";
import path from "path";
import fs from "fs";

const app = express();

// Trust proxy for proper protocol detection behind load balancers (Replit Deployment)
app.set('trust proxy', true);

app.use(compression());

const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Serve sitemap.xml with correct content type (must be before redirects)
app.get("/sitemap.xml", (req, res) => {
  const sitemapPath = path.join(process.cwd(), "client", "public", "sitemap.xml");
  if (fs.existsSync(sitemapPath)) {
    res.setHeader("Content-Type", "application/xml");
    res.sendFile(sitemapPath);
  } else {
    res.status(404).send("Sitemap not found");
  }
});

// Serve llms.txt for AI search engines (must be before redirects)
app.get("/llms.txt", (req, res) => {
  const llmsPath = path.join(process.cwd(), "client", "public", "llms.txt");
  if (fs.existsSync(llmsPath)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.sendFile(llmsPath);
  } else {
    res.status(404).send("LLMs.txt not found");
  }
});

// Serve robots.txt with correct content type (must be before redirects)
app.get("/robots.txt", (req, res) => {
  const robotsPath = path.join(process.cwd(), "client", "public", "robots.txt");
  if (fs.existsSync(robotsPath)) {
    res.setHeader("Content-Type", "text/plain");
    res.sendFile(robotsPath);
  } else {
    res.status(404).send("Robots.txt not found");
  }
});

// Serve ad-google.html with Firebase config injected
app.get("/ad-google.html", (req, res) => {
  const htmlPath = path.join(process.cwd(), "public", "ad-google.html");
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, "utf-8");
    // Inject Firebase config from environment variables
    html = html.replace("FIREBASE_API_KEY", process.env.VITE_FIREBASE_API_KEY || "");
    html = html.replace("FIREBASE_AUTH_DOMAIN", process.env.VITE_FIREBASE_AUTH_DOMAIN || "");
    html = html.replace("FIREBASE_PROJECT_ID", process.env.VITE_FIREBASE_PROJECT_ID || "");
    html = html.replace("FIREBASE_APP_ID", process.env.VITE_FIREBASE_APP_ID || "");
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } else {
    res.status(404).send("Page not found");
  }
});

// Serve static files from public folder with appropriate caching headers
app.use(express.static(path.join(process.cwd(), "public"), {
  etag: true,
  setHeaders: (res, filePath) => {
    // Long cache for immutable assets (images, fonts)
    if (filePath.endsWith('.webp') || filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.woff2')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      // Long cache for JS/CSS (versioned by bundler)
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('.html')) {
      // No cache for HTML files
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    // Other files use Express defaults (no explicit header)
  }
}));

setupRedirects(app);
setupBotSSR(app);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
