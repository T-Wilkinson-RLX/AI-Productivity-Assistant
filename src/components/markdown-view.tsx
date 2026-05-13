import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none rounded-md border border-border/60 bg-background/40 p-4
      prose-headings:font-semibold prose-headings:text-foreground
      prose-h1:text-xl prose-h2:text-lg prose-h2:mt-4 prose-h2:mb-2 prose-h2:border-b prose-h2:border-border/60 prose-h2:pb-1
      prose-h3:text-base prose-h3:mt-3
      prose-p:text-foreground/90 prose-p:leading-relaxed
      prose-strong:text-foreground
      prose-a:text-accent
      prose-ul:my-2 prose-li:my-0.5 prose-li:marker:text-accent
      prose-code:rounded prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
      prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground
      prose-hr:border-border/60">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
