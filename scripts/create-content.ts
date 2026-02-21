import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

// Helper script for the AI to quickly generate template files.
// Usage: tsx scripts/create-content.ts <type> <slug> <title>
// type: "blog" | "project"

const type = process.argv[2];
const slug = process.argv[3];
const title = process.argv[4] || "TBD";

if (!type || !slug) {
    console.error("Usage: tsx scripts/create-content.ts <blog|project> <slug> <title>");
    process.exit(1);
}

const isBlog = type === "blog";
const directory = path.join(process.cwd(), "content", isBlog ? "blog" : "projects");
const filepath = path.join(directory, `${slug}.md`);

if (fs.existsSync(filepath)) {
    console.error(`Error: File already exists at ${filepath}`);
    process.exit(1);
}

const today = new Date().toISOString().split("T")[0];

const blogTemplate = `---
title: "${title}"
summary: "Brief summary of the blog post"
date: "${today}"
category: "General"
tags:
  - "Engineering"
featured: false
---

# Introduction

Write your content here...
`;

const projectTemplate = `---
title: "${title}"
summary: "Brief description of the project"
role: "Software Engineer"
timeline: "1 month"
featured: false
order: 999
stack:
  - "Next.js"
  - "Supabase"
impact:
  - "What was the business value?"
links:
  repo: "https://github.com/..."
  demo: "https://..."
---

## Overview

Project details go here...
`;

// 1. Create the markdown file
const content = isBlog ? blogTemplate : projectTemplate;
fs.writeFileSync(filepath, content, "utf8");
console.log(`✅ Created template at: ${filepath}`);

// 2. Instruct the user (or AI) to finish writing, then sync
console.log(`\nNext Steps:`);
console.log(`1. Edit the file to add your actual content.`);
console.log(`2. Run: npx tsx scripts/upload-content.ts`);
console.log(`to push the new content to Supabase.`);
