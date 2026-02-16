import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = "https://yoongeonchoi.github.io";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const OUTPUT_FILE = path.join(process.cwd(), "public", "feed.xml");

function xmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getPosts() {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.(md|mdx)$/u, "");
      const source = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(source);

      if (data.draft) {
        return null;
      }

      const title = typeof data.title === "string" ? data.title : slug;
      const summary = typeof data.summary === "string" ? data.summary : "";
      const date = typeof data.date === "string" ? data.date : new Date().toISOString();

      return {
        slug,
        title,
        summary,
        date,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function buildXml(posts) {
  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`;
      return `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid>${xmlEscape(link)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${xmlEscape(post.summary)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Yoongeon Choi Blog</title>
    <link>${SITE_URL}</link>
    <description>Security-first product engineering writing.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>
`;
}

const posts = getPosts();
const xml = buildXml(posts);
fs.writeFileSync(OUTPUT_FILE, xml, "utf8");
console.log(`Generated RSS with ${posts.length} posts -> public/feed.xml`);
