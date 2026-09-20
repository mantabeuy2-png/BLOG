import React from 'react';

interface ArticleContentRendererProps {
  content: string;
}

export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({ content }) => {
  return (
    <div
      className="editorial-prose font-sans-ui text-neutral-800 text-[17px] sm:text-[18px] leading-[1.78] max-w-[720px] mx-auto space-y-6"
    >
      <style>{`
        .editorial-prose h2 {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }
        .editorial-prose h3 {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .editorial-prose p {
          margin-bottom: 1.5rem;
        }
        .editorial-prose blockquote {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.35rem;
          line-height: 1.5;
          color: #262626;
          border-left: 3px solid #D9381E;
          padding-left: 1.5rem;
          margin: 2.25rem 0;
        }
        .editorial-prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          space-y: 0.5rem;
        }
        .editorial-prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          space-y: 0.5rem;
        }
        .editorial-prose li {
          margin-bottom: 0.5rem;
        }
        .editorial-prose strong {
          font-weight: 600;
          color: #111827;
        }
        .editorial-prose a {
          color: #D9381E;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .editorial-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.95rem;
        }
        .editorial-prose th, .editorial-prose td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          text-align: left;
        }
        .editorial-prose th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        .editorial-prose pre {
          background-color: #18181b;
          color: #f4f4f5;
          padding: 1.25rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          margin: 2rem 0;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};
