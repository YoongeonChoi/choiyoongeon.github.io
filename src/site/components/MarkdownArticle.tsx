interface MarkdownArticleProps {
  html: string;
}

export function MarkdownArticle({ html }: MarkdownArticleProps) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
