import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ArticleCard } from '../../components/frontend/ArticleCard';
import { PopularSidebar } from '../../components/frontend/PopularSidebar';
import { ChevronRight, Filter, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug }) => {
  const { categories, articles, goToHome } = useCms();
  const [displayCount, setDisplayCount] = useState(6);

  const category = categories.find(
    (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.id.toLowerCase() === slug.toLowerCase()
  ) || categories[0];

  const categoryArticles = articles.filter(
    (a) => a.categoryId === category.id || a.category.toLowerCase() === category.name.toLowerCase()
  );

  const featuredCategoryArticle = categoryArticles[0];
  const remainingArticles = categoryArticles.slice(1, displayCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-sans-ui">
        <button onClick={goToHome} className="hover:text-neutral-900">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <span className="text-neutral-900 font-semibold uppercase tracking-wider">
          {category.name}
        </span>
      </div>

      {/* Category Header */}
      <div className="border-b-2 border-neutral-900 pb-8 mb-10">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-2">
            Kanal Redaksi
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-editorial text-neutral-900 tracking-tight">
            {category.name}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 font-sans-ui leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Column */}
        <div className="lg:col-span-8">
          {/* Featured in category */}
          {featuredCategoryArticle && (
            <div className="mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Sorotan Utama Kanal
              </span>
              <ArticleCard article={featuredCategoryArticle} variant="grid" />
            </div>
          )}

          {/* Remaining grid */}
          <div className="mt-8">
            <h3 className="text-lg font-bold font-serif-editorial text-neutral-900 pb-3 border-b border-neutral-200 mb-6">
              Arsip Naskah {category.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {remainingArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="grid" />
              ))}
            </div>

            {categoryArticles.length === 0 && (
              <div className="py-16 text-center text-neutral-400 bg-white rounded-xl border border-neutral-200">
                Belum ada naskah yang diterbitkan dalam kategori ini.
              </div>
            )}

            {/* Load More Button */}
            {categoryArticles.length > displayCount && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setDisplayCount((prev) => prev + 4)}
                  className="px-6 py-2.5 rounded-full border border-neutral-300 hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition-colors"
                >
                  Muat Naskah Lainnya
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <PopularSidebar articles={articles} />
        </aside>
      </div>
    </div>
  );
};
