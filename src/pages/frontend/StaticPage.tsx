import React from 'react';
import { useCms } from '../../context/CmsContext';
import { ArticleContentRenderer } from '../../components/frontend/ArticleContentRenderer';
import { ChevronRight } from 'lucide-react';

interface StaticPageProps {
  slug: string;
}

export const StaticPage: React.FC<StaticPageProps> = ({ slug }) => {
  const { staticPages, goToHome } = useCms();

  const page = staticPages.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id.toLowerCase() === slug.toLowerCase()
  ) || staticPages[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-sans-ui">
        <button onClick={goToHome} className="hover:text-neutral-900">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <span className="text-neutral-900 font-semibold">{page.title}</span>
      </div>

      <div className="border-b-2 border-neutral-900 pb-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-editorial text-neutral-900 tracking-tight">
          {page.title}
        </h1>
        <p className="mt-2 text-xs text-neutral-400 font-mono-code">
          Terakhir diperbarui: {page.updatedAt}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-neutral-200/80 shadow-xs">
        <ArticleContentRenderer content={page.content} />
      </div>
    </div>
  );
};
