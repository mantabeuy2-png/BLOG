import React from 'react';
import { Article } from '../../types';
import { useCms } from '../../context/CmsContext';
import { Clock, Bookmark, ArrowUpRight, Play } from 'lucide-react';
import { extractYouTubeVideoId } from '../../utils/youtube';

interface HeroArticleProps {
  article: Article;
}

export const HeroArticle: React.FC<HeroArticleProps> = ({ article }) => {
  const { goToArticle, goToCategory, goToAuthor, isBookmarked, toggleBookmark } = useCms();
  const bookmarked = isBookmarked(article.id);
  const isVideo = article.mediaType === 'video' || Boolean(article.youtubeVideoId) || Boolean(extractYouTubeVideoId(article.youtubeUrl));

  return (
    <section className="relative my-6 sm:my-8">
      <div className="group cursor-pointer rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Mobile Image (rendered first on mobile, or in desktop order via flex/order) */}
          <div className="lg:order-2 lg:col-span-7 relative overflow-hidden bg-neutral-100 min-h-[260px] sm:min-h-[380px] lg:min-h-[460px]">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl backdrop-blur-xs group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </span>
              </div>
            )}
            {/* Category tag on image for mobile visual anchor */}
            <div className="absolute top-4 left-4 lg:hidden flex items-center gap-1.5">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-xs text-neutral-900 text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs">
                {article.category}
              </span>
              {isVideo && (
                <span className="px-2.5 py-1 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 backdrop-blur-xs">
                  <Play className="w-2.5 h-2.5 fill-current" /> Video
                </span>
              )}
            </div>
            {isVideo && (
              <div className="hidden lg:flex absolute bottom-4 right-4 items-center gap-1.5 px-3 py-1 bg-black/80 text-white text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-xs">
                <Play className="w-3 h-3 fill-current" /> Liputan Video
              </div>
            )}
          </div>

          {/* Text & Metadata Column */}
          <div className="lg:order-1 lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Category Pill (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToCategory(article.categoryId);
                  }}
                  className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors"
                >
                  {article.category}
                </button>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-neutral-500 font-medium">Liputan Utama</span>
              </div>

              {/* Big Editorial Headline */}
              <h1
                onClick={() => goToArticle(article.slug)}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold font-serif-editorial text-neutral-900 leading-[1.18] tracking-tight group-hover:text-red-700 transition-colors"
              >
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-sans-ui line-clamp-3 sm:line-clamp-4">
                {article.excerpt}
              </p>
            </div>

            {/* Author & Footer Metadata */}
            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  goToAuthor(article.author.slug);
                }}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 leading-tight">
                    {article.author.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readingTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(article.id);
                  }}
                  className={`p-2 rounded-full border transition-colors ${
                    bookmarked
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'text-neutral-400 hover:text-neutral-800 border-neutral-200 hover:bg-neutral-50'
                  }`}
                  title={bookmarked ? 'Hapus Simpanan' : 'Simpan Artikel'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>

                <button
                  type="button"
                  onClick={() => goToArticle(article.slug)}
                  className="hidden sm:flex p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                  title="Baca Selengkapnya"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
