/**
 * Simple MDX/Markdown renderer for blog posts.
 * Renders content as styled HTML with the blog-content class for deep linking.
 * In production, consider using next-mdx-remote for full MDX support.
 */

interface MDXRendererProps {
    content: string;
}

/**
 * Converts basic Markdown to HTML.
 * This is a lightweight renderer for static export. For full MDX support,
 * integrate next-mdx-remote or @mdx-js/react.
 */
function markdownToHtml(md: string): string {
    let html = md;

    // Code blocks (```...```)
    html = html.replace(
        /```(\w*)\n([\s\S]*?)```/g,
        '<pre class="rounded-xl p-4 overflow-x-auto glass-inset my-4"><code class="language-$1 text-sm">$2</code></pre>'
    );

    // Inline code
    html = html.replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-accent-muted text-accent text-sm font-mono">$1</code>'
    );

    // Headers
    html = html.replace(
        /^### (.+)$/gm,
        '<h3 class="text-lg font-bold text-text-primary mt-8 mb-3">$1</h3>'
    );
    html = html.replace(
        /^## (.+)$/gm,
        '<h2 class="text-xl font-bold text-text-primary mt-10 mb-4">$1</h2>'
    );
    html = html.replace(
        /^# (.+)$/gm,
        '<h1 class="text-2xl font-bold text-text-primary mt-10 mb-4">$1</h1>'
    );

    // Bold & Italic
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Links
    html = html.replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" class="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Images
    html = html.replace(
        /!\[(.+?)\]\((.+?)\)/g,
        '<img src="$2" alt="$1" class="rounded-xl my-6 w-full" loading="lazy" />'
    );

    // Blockquotes
    html = html.replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-accent pl-4 py-2 my-4 text-text-secondary italic">$1</blockquote>'
    );

    // Unordered lists
    html = html.replace(
        /^- (.+)$/gm,
        '<li class="text-text-secondary ml-4 list-disc">$1</li>'
    );

    // Horizontal rules
    html = html.replace(
        /^---$/gm,
        '<hr class="border-border-default my-8" />'
    );

    // Paragraphs — wrap remaining lines
    html = html
        .split("\n\n")
        .map((block) => {
            if (
                block.startsWith("<") ||
                block.trim() === ""
            )
                return block;
            return `<p class="text-text-secondary leading-relaxed mb-4">${block}</p>`;
        })
        .join("\n");

    return html;
}

export function MDXRenderer({ content }: MDXRendererProps) {
    const html = markdownToHtml(content);

    return (
        <div
            className="blog-content prose-custom max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
