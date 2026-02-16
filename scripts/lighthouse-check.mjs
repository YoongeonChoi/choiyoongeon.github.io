import http from "node:http";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const TMP_DIR = path.join(ROOT, ".lighthouse");
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const routes = [
  { path: "/", report: "home.json" },
  { path: "/blog/", report: "blog.json" },
];

const thresholds = {
  performance: 0.9,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.95,
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

function isCompressible(contentType) {
  return (
    contentType.startsWith("text/") ||
    contentType.includes("javascript") ||
    contentType.includes("json") ||
    contentType.includes("xml")
  );
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, BASE_URL);
  const decodedPath = decodeURIComponent(url.pathname);
  const normalized = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  return normalized;
}

function resolveFilePath(requestPath) {
  let filePath = path.join(OUT_DIR, requestPath);

  if (requestPath.endsWith("/")) {
    filePath = path.join(filePath, "index.html");
  } else if (!path.extname(filePath)) {
    const asDir = path.join(filePath, "index.html");
    if (fs.existsSync(asDir)) {
      filePath = asDir;
    }
  }

  if (filePath.startsWith(OUT_DIR)) {
    return filePath;
  }

  return path.join(OUT_DIR, "404.html");
}

function createStaticServer() {
  return http.createServer((req, res) => {
    try {
      const requestPath = resolveRequestPath(req.url ?? "/");
      let filePath = resolveFilePath(requestPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(OUT_DIR, "404.html");
        res.statusCode = 404;
      }

      const raw = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const contentType = contentTypes[ext] ?? "application/octet-stream";
      const encoding = req.headers["accept-encoding"] ?? "";

      let body = raw;
      let contentEncoding;

      if (isCompressible(contentType) && raw.length > 1024) {
        if (encoding.includes("br")) {
          body = zlib.brotliCompressSync(raw);
          contentEncoding = "br";
        } else if (encoding.includes("gzip")) {
          body = zlib.gzipSync(raw);
          contentEncoding = "gzip";
        }
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      if (contentEncoding) {
        res.setHeader("Content-Encoding", contentEncoding);
      }
      res.setHeader("Content-Length", String(body.length));

      if (req.method === "HEAD") {
        res.end();
        return;
      }

      res.end(body);
    } catch {
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });
}

function readScores(reportPath) {
  const data = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const scores = {
    performance: data.categories.performance.score,
    accessibility: data.categories.accessibility.score,
    "best-practices": data.categories["best-practices"].score,
    seo: data.categories.seo.score,
  };

  return { url: data.finalUrl, scores };
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve());
  });
}

function close(server) {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

async function main() {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });

  const server = createStaticServer();
  await listen(server, PORT);

  try {
    for (const route of routes) {
      const outputPath = path.join(TMP_DIR, route.report);
      await run("npx", [
        "-y",
        "lighthouse",
        `${BASE_URL}${route.path}`,
        "--quiet",
        "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--output=json",
        `--output-path=${outputPath}`,
      ]);
    }

    let failed = false;

    for (const route of routes) {
      const reportPath = path.join(TMP_DIR, route.report);
      const { url, scores } = readScores(reportPath);
      console.log(`\nLighthouse: ${url}`);

      for (const [category, value] of Object.entries(scores)) {
        const pct = Math.round(value * 100);
        const min = Math.round(thresholds[category] * 100);
        const mark = value >= thresholds[category] ? "PASS" : "FAIL";
        console.log(`  ${category}: ${pct} (target ${min}) ${mark}`);
        if (value < thresholds[category]) {
          failed = true;
        }
      }
    }

    if (failed) {
      throw new Error("Lighthouse thresholds not met");
    }
  } finally {
    await close(server);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
