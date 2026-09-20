import React from 'react';
import { Article } from '../../types';
import { useCms } from '../../context/CmsContext';
import { Clock, Bookmark, Play } from 'lucide-react';
import { extractYouTubeVideoId } from '../../utils/youtube';

interface ArticleCardProps {
  article: Article;
  variant?: 'grid' | 'horizontal' | 'compact';
  showExcerpt?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'grid',
  showExcerpt = true
}) => {
  const { goToArticle, goToCategory, goToAuthor, isBookmarked, toggleBookmark } = useCms();
  const bookmarked = isBookmarked(article.id);
  const isVideo = article.mediaType === 'video' || Boolean(article.youtubeVideoId) || Boolean(extractYouTubeVideoId(article.youtubeUrl));

  if (variant === 'horizontal') {
    return (
      <article
        onClick={() => goToArticle(article.slug)}
        className="group cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-6 py-5 border-b border-neutral-200/70 hover:opacity-95 transition-all"
      >
        <div className="sm:w-1/3 aspect-16/10 sm:aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 shrink-0 relative">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md backdrop-blur-xs group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </span>
            </div>
          )}
          {isVideo && (
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-0.5 bg-black/80 text-white text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1 backdrop-blur-xs">
                <Play className="w-2 h-2 fill-current" /> Video
              </span>
            </div>
          )}
        </div>

        <div className="sm:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToCategory(article.categoryId);
                }}
                className="text-[11px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700"
              >
                {article.category}
              </button>
              <span className="text-neutral-300">•</span>
              <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTime}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-neutral-900 leading-snug group-hover:text-red-600 transition-colors">
              {article.title}
            </h3>

            {showExcerpt && (
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed font-sans-ui">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-neutral-500">
            <div
              onClick={(e) => {
                e.stopPropagation();
                goToAuthor(article.author.slug);
              }}
              className="flex items-center gap-2 hover:text-neutral-800"
            >
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="font-medium text-neutral-700">{article.author.name}</span>
              <span>•</span>
              <span>{article.publishedAt}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(article.id);
              }}
              className={`p-1.5 rounded-full hover:bg-neutral-100 transition-colors ${
                bookmarked ? 'text-red-600' : 'text-neutral-400'
              }`}
              title={bookmarked ? 'Hapus Simpanan' : 'Simpan'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        onClick={() => goToArticle(article.slug)}
        className="group cursor-pointer flex gap-4 py-3.5 border-b border-neutral-100 last:border-b-0 hover:opacity-95"
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 relative">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
              <span className="w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xs">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
            {article.category}
          </span>
          <h4 className="text-sm font-bold font-serif-editorial text-neutral-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mt-0.5">
            {article.title}
          </h4>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
            <span>{article.author.name}</span>
            <span>•</span>
            <span>{article.readingTime}</span>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Variant
  return (
    <article
      onClick={() => goToArticle(article.slug)}
      className="group cursor-pointer flex flex-col justify-between bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
    >
      <div>
        <div className="aspect-16/10 overflow-hidden bg-neutral-100 relative">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-xs group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToCategory(article.categoryId);
              }}
              className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs hover:text-red-600"
            >
              {article.category}
            </button>
          </div>
          {isVideo && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 backdrop-blur-xs">
                <Play className="w-2.5 h-2.5 fill-current" /> Video
              </span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold font-serif-editorial text-neutral-900 leading-snug group-hover:text-red-600 transition-colors">
            {article.title}
          </h3>

          {showExcerpt && (
            <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed font-sans-ui">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <div
          onClick={(e) => {
            e.stopPropagation();
            goToAuthor(article.author.slug);
          }}
          className="flex items-center gap-2 hover:text-neutral-900"
        >
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-neutral-200"
          />
          <span className="font-medium text-neutral-800 truncate max-w-[120px]">{article.author.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-neutral-400">{article.readingTime}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(article.id);
            }}
            className={`p-1 rounded-md hover:bg-neutral-100 transition-colors ${
              bookmarked ? 'text-red-600' : 'text-neutral-400 hover:text-neutral-700'
            }`}
            title={bookmarked ? 'Hapus Simpanan' : 'Simpan'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </article>
  );
};
