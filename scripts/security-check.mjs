import fs from "node:fs";
import path from "node:path";

const ROOTS = [
  path.join(process.cwd(), "src", "app"),
  path.join(process.cwd(), "src", "site"),
  path.join(process.cwd(), "src", "lib", "content"),
  path.join(process.cwd(), "src", "lib", "security"),
];
const ALLOWED_DSIH_FILES = new Set([
  path.join("src", "site", "components", "MarkdownArticle.tsx"),
]);

const forbiddenPatterns = [
  { regex: /\beval\s*\(/g, label: "eval() usage" },
  { regex: /new\s+Function\s*\(/g, label: "Function constructor usage" },
  { regex: /document\.write\s*\(/g, label: "document.write usage" },
  { regex: /\.innerHTML\s*=/g, label: "innerHTML assignment" },
  { regex: /http:\/\//g, label: "insecure http:// URL" },
];

const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (/\.(ts|tsx|js|jsx|mjs|md|mdx|css)$/u.test(entry.name)) {
      files.push(fullPath);
    }
  }
}

for (const root of ROOTS) {
  if (fs.existsSync(root)) {
    walk(root);
  }
}

const issues = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const relative = path.relative(process.cwd(), file);

  for (const pattern of forbiddenPatterns) {
    if (pattern.regex.test(source)) {
      issues.push(`${relative}: ${pattern.label}`);
    }
  }

  if (source.includes("dangerouslySetInnerHTML") && !ALLOWED_DSIH_FILES.has(relative)) {
    issues.push(`${relative}: dangerouslySetInnerHTML is not allowed here`);
  }
}

if (issues.length > 0) {
  console.error("Security check failed:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log("Security check passed.");
