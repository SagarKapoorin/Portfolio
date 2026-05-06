import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Callout } from "@/components/mdx/Callout";
import { Mermaid } from "@/components/mdx/Mermaid";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[]}
      components={{
        h2: ({ children }) => <h2 className="mt-10 text-3xl font-semibold text-[#f7f8f8]">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-8 text-2xl font-medium text-[#f7f8f8]">{children}</h3>,
        p: ({ children }) => <p className="mt-4 text-base leading-8 text-[#8a8f98]">{children}</p>,
        ul: ({ children }) => <ul className="mt-4 list-disc space-y-3 pl-6 text-[#8a8f98]">{children}</ul>,
        li: ({ children }) => <li className="leading-7">{children}</li>,
        blockquote: ({ children }) => <Callout>{children}</Callout>,
        code: ({ className, children }) => {
          const code = String(children).trim();
          const isMermaid = className?.includes("language-mermaid");
          if (isMermaid) {
            return <Mermaid code={code} />;
          }
          return (
            <code className="rounded bg-[#141516] px-1.5 py-1 text-sm text-[#f7f8f8]">{children}</code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8ea0ff] underline decoration-[#5e6ad2]/60 underline-offset-4"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

