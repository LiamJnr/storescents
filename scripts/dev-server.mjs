import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const isDistMode = process.argv.includes("--dist");
const serveBase = isDistMode ? path.join(rootDir, "dist") : rootDir;
const port = 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2"
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  if (reqPath === "/") reqPath = isDistMode ? "/index.html" : "/public/index.html";

  let filePath = path.join(serveBase, reqPath);

  // In development mode, check public directory for static assets (images, favicon, etc.)
  if (!isDistMode && !fs.existsSync(filePath)) {
    const publicCandidate = path.join(rootDir, "public", reqPath);
    if (fs.existsSync(publicCandidate)) {
      filePath = publicCandidate;
    }
  }

  // If path doesn't have an extension and is not an API call, serve SPA shell
  const ext = path.extname(filePath);
  if (!ext && !reqPath.startsWith("/api/")) {
    filePath = path.join(serveBase, isDistMode ? "index.html" : "public/index.html");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback for client-side routing
      const fallbackPath = path.join(serveBase, isDistMode ? "index.html" : "public/index.html");
      fs.readFile(fallbackPath, (fallbackErr, content) => {
        if (fallbackErr) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content, "utf-8");
      });
      return;
    }

    const fileExt = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[fileExt] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    });
  });
});

server.listen(port, () => {
  console.log(`\n🌹 NOVEAU / Store Scents dev server running at: http://localhost:${port}`);
  console.log(`   Serving from: ${serveBase}\n`);
});
