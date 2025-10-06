"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Rendu Markdown basique, sans HTML brut. */
export default function Markdown({ source }: { source: string }) {
  return (
    <article className="prose prose-neutral max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // rehypeRaw non activé => pas de HTML brut
        components={{
          a: (props) => (
            <a {...props} target="_blank" rel="noopener noreferrer nofollow" />
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
