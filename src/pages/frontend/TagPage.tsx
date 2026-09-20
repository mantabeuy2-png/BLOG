import React from 'react';
import { useCms } from '../../context/CmsContext';
import { ArticleCard } from '../../components/frontend/ArticleCard';
import { ChevronRight, Tag as TagIcon } from 'lucide-react';

interface TagPageProps {
  slug: string;
}

export const TagPage: React.FC<TagPageProps> = ({ slug }) => {
  const { tags, articles, goToHome } = useCms();

  const formattedTag = slug.replace(/-/g, ' ');
  const matchingArticles = articles.filter(
    (a) =>
      a.status === 'published' &&
      a.tags?.some((t) => t.toLowerCase() === formattedTag.toLowerCase() || t.toLowerCase() === slug.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-sans-ui">
        <button onClick={goToHome} className="hover:text-neutral-900">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <span>Topik</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <span className="text-neutral-900 font-semibold">#{formattedTag}</span>
      </div>

      <div className="border-b-2 border-neutral-900 pb-6 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-2 flex items-center gap-1.5">
          <TagIcon className="w-3.5 h-3.5" />
          Indeks Topik Redaksi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-editorial text-neutral-900">
          #{formattedTag}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Menampilkan {matchingArticles.length} artikel terhubung dengan kata kunci ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matchingArticles.map((art) => (
          <ArticleCard key={art.id} article={art} variant="grid" />
        ))}
      </div>

      {matchingArticles.length === 0 && (
        <div className="py-20 text-center bg-white rounded-xl border border-neutral-200">
          <p className="text-neutral-400 font-serif-editorial text-lg">
            Belum ada artikel untuk topik ini.
          </p>
        </div>
      )}
    </div>
  );
};
