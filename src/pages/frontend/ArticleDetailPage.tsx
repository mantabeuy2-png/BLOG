import React, { useEffect, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { ArticleContentRenderer } from '../../components/frontend/ArticleContentRenderer';
import { AuthorBox } from '../../components/frontend/AuthorBox';
import { SocialShare } from '../../components/frontend/SocialShare';
import { CommentsSection } from '../../components/frontend/CommentsSection';
import { ArticleCard } from '../../components/frontend/ArticleCard';
import { PopularSidebar } from '../../components/frontend/PopularSidebar';
import { Newsletter } from '../../components/frontend/Newsletter';
import { AdSlotBanner } from '../../components/frontend/AdSlotBanner';
import { Clock, MessageSquare, ChevronRight, Eye, Tag as TagIcon, Sparkles, Play, Video, ExternalLink } from 'lucide-react';
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from '../../utils/youtube';

interface ArticleDetailPageProps {
  slug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug }) => {
  const { articles, categories, goToHome, goToCategory, goToTag, recordArticleView } = useCms();

  // Find article by slug or id
  const article = articles.find((a) => a.slug === slug || a.id === slug) || articles[0];

  const commentsRef = useRef<HTMLDivElement>(null);

  // Record view
  useEffect(() => {
    if (article) {
      recordArticleView(article.id);
    }
  }, [article?.id]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">Naskah Tidak Ditemukan</h2>
        <p className="mt-2 text-sm text-neutral-500">Artikel yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
        <button
          onClick={goToHome}
          className="mt-6 px-4 py-2 bg-neutral-900 text-white text-xs rounded-lg font-semibold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Related articles (same category or others, max 3)
  const relatedArticles = articles
    .filter((a) => a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  const scrollToComments = () => {
    const el = document.getElementById('comments-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <article className="min-h-screen pb-20">
      {/* Editorial Breadcrumb */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-2 text-xs text-neutral-500 font-sans-ui overflow-x-auto">
          <button onClick={goToHome} className="hover:text-neutral-900 transition-colors">
            Beranda
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
          <button
            onClick={() => goToCategory(article.categoryId)}
            className="hover:text-neutral-900 font-medium text-red-600 transition-colors shrink-0"
          >
            {article.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
          <span className="text-neutral-800 font-medium truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Top Header Leaderboard Ad Slot */}
        <AdSlotBanner position="header_banner" className="max-w-4xl mx-auto mb-8" />

        {/* Top Article Header Area (Matches visual reference Screenshot 1) */}
        <header className="max-w-4xl mx-auto mb-10 text-center sm:text-left">
          {/* Category Badge & Trending */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-4">
            <button
              onClick={() => goToCategory(article.categoryId)}
              className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-red-100 transition-colors"
            >
              {article.category}
            </button>
            {article.isTrending && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Trending
              </span>
            )}
          </div>

          {/* Large Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif-editorial text-neutral-900 leading-[1.15] tracking-tight">
            {article.title}
          </h1>

          {/* Short Excerpt */}
          {article.excerpt && (
            <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans-ui leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Author Metadata & Publication Line */}
          <div className="mt-6 pt-6 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-200"
              />
              <div className="text-left">
                <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                  {article.author.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                  <span>{article.author.role}</span>
                  <span>•</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-500 font-sans-ui">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {article.readingTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-neutral-400" />
                {article.views.toLocaleString()} pembaca
              </span>
            </div>
          </div>

          {/* Horizontal Social Share on Header */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <SocialShare
              articleTitle={article.title}
              articleId={article.id}
              commentCount={3}
              onScrollToComments={scrollToComments}
              orientation="horizontal"
            />
          </div>
        </header>

        {/* Featured Media (Large Editorial Header Image or YouTube Video Player) */}
        <div className="max-w-5xl mx-auto mb-12">
          {(() => {
            const detectedVideoId = article.youtubeVideoId || extractYouTubeVideoId(article.youtubeUrl);
            const isVideo = article.mediaType === 'video' || Boolean(detectedVideoId);

            if (isVideo && detectedVideoId) {
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Liputan Video Editorial
                    </span>
                    <a
                      href={`https://www.youtube.com/watch?v=${detectedVideoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
                    >
                      Tonton di YouTube <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-16/9 max-h-[560px] border border-neutral-800">
                    <iframe
                      src={getYouTubeEmbedUrl(detectedVideoId, false)}
                      title={article.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            }

            return (
              <div className="rounded-2xl overflow-hidden shadow-sm bg-neutral-100 aspect-16/9 sm:aspect-21/9 max-h-[520px]">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })()}
          {article.imageCaption && (
            <p className="mt-2.5 text-center text-xs text-neutral-500 italic font-sans-ui">
              {article.imageCaption}
            </p>
          )}
        </div>

        {/* Main Content Layout with Sticky Sidebar (Matches Layout Pos.jpg reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column (Main Article Body) */}
          <main className="lg:col-span-8">
            {/* Article Body Content */}
            <ArticleContentRenderer content={article.content} />

            {/* In-Feed Native Sponsored Reading Ad */}
            <AdSlotBanner position="article_in_feed" className="max-w-[720px] mx-auto my-8" />

            {/* Tags section */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-neutral-200/80 max-w-[720px] mx-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2 flex items-center gap-1">
                    <TagIcon className="w-3.5 h-3.5" />
                    Topik:
                  </span>
                  {article.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => goToTag(tag)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Share Bar */}
            <div className="mt-8 p-4 rounded-xl bg-neutral-50 border border-neutral-200 max-w-[720px] mx-auto">
              <SocialShare
                articleTitle={article.title}
                articleId={article.id}
                orientation="horizontal"
              />
            </div>

            {/* Author Box */}
            <div className="mt-10 max-w-[720px] mx-auto">
              <AuthorBox author={article.author} />
            </div>

            {/* Related Articles Section (3 cards) */}
            <section className="mt-14 pt-10 border-t border-neutral-200">
              <div className="flex items-center justify-between pb-3 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-editorial text-neutral-900">
                  Naskah Terkait Lainnya
                </h3>
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                  Rekomendasi Editor
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.id} article={rel} variant="grid" showExcerpt={false} />
                ))}
              </div>
            </section>

            {/* Bottom Article Sponsorship Banner */}
            <AdSlotBanner position="article_bottom" className="max-w-[720px] mx-auto my-8" />

            {/* Reader Comments Section */}
            <div className="max-w-[720px] mx-auto">
              <CommentsSection articleId={article.id} articleTitle={article.title} />
            </div>
          </main>

          {/* Right Column: Editorial Sidebar (Desktop sticky, mobile content section) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            {/* Popular Stories */}
            <PopularSidebar articles={articles} />

            {/* Sidebar Square/Medium Rectangle Ad */}
            <AdSlotBanner position="sidebar_top" className="my-6" />

            {/* Newsletter Subscription */}
            <div className="p-6 rounded-xl bg-neutral-900 text-white">
              <h4 className="font-bold font-serif-editorial text-lg">Buletin Redaksi</h4>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Dapatkan artikel kurasi mendalam langsung di surel Anda setiap akhir pekan.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Terima kasih telah berlangganan!');
                }}
                className="mt-4 space-y-2.5"
              >
                <input
                  type="email"
                  required
                  placeholder="surel@domain.id"
                  className="w-full px-3 py-2 text-xs bg-white/10 text-white placeholder-neutral-400 rounded-lg border border-white/20 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-white text-neutral-900 font-bold text-xs rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Daftar Buletin
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Bottom Sticky Bar Ad Slot */}
      <AdSlotBanner position="footer_banner" />
    </article>
  );
};
