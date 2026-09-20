import React from 'react';
import { Article } from '../../types';
import { useCms } from '../../context/CmsContext';
import { TrendingUp, Clock } from 'lucide-react';

interface PopularSidebarProps {
  articles: Article[];
}

export const PopularSidebar: React.FC<PopularSidebarProps> = ({ articles }) => {
  const { goToArticle, goToCategory } = useCms();

  // Sort by views or take top 5
  const sortedArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs">
      <div className="flex items-center gap-2 pb-4 border-b border-neutral-100 mb-4">
        <TrendingUp className="w-4 h-4 text-red-600" />
        <h3 className="text-base font-bold font-serif-editorial text-neutral-900 tracking-tight">
          Paling Banyak Dibaca
        </h3>
      </div>

      <div className="space-y-5">
        {sortedArticles.map((art, idx) => {
          const numberFormatted = String(idx + 1).padStart(2, '0');
          return (
            <div
              key={art.id}
              onClick={() => goToArticle(art.slug)}
              className="group cursor-pointer flex items-start gap-4"
            >
              {/* Big Editorial Number */}
              <span className="text-2xl sm:text-3xl font-extrabold font-serif-editorial text-neutral-300 group-hover:text-red-600 transition-colors shrink-0 w-8 leading-none mt-0.5">
                {numberFormatted}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCategory(art.categoryId);
                    }}
                    className="hover:underline"
                  >
                    {art.category}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-neutral-400 font-normal flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {art.readingTime}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-serif-editorial text-neutral-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                  {art.title}
                </h4>

                <div className="mt-1 text-[11px] text-neutral-400">
                  {art.author.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
