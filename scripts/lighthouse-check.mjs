import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function main() {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });

  const server = spawn("npx", ["-y", "serve", "-s", "out", "-l", String(PORT)], {
    cwd: ROOT,
    stdio: "ignore",
  });

  try {
    await sleep(2500);

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
    server.kill("SIGINT");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
