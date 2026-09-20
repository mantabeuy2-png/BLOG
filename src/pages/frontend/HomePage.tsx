import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { HeroArticle } from '../../components/frontend/HeroArticle';
import { FeaturedStories } from '../../components/frontend/FeaturedStories';
import { ArticleCard } from '../../components/frontend/ArticleCard';
import { PopularSidebar } from '../../components/frontend/PopularSidebar';
import { Newsletter } from '../../components/frontend/Newsletter';
import { AdSlotBanner } from '../../components/frontend/AdSlotBanner';
import { Sparkles, ArrowRight, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { articles, categories, goToCategory } = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  const publishedArticles = articles.filter((a) => a.status === 'published');

  // Hero article: designated hero or fallback to first
  const heroArticle = publishedArticles.find((a) => a.isFeaturedHero) || publishedArticles[0];

  // Featured articles (excluding hero): 1 main prominent story + 5 side thumbnail stories = 6 total
  const secondaryFeatured = publishedArticles.filter((a) => a.id !== heroArticle?.id && a.isFeaturedSecondary);
  const otherCandidates = publishedArticles.filter((a) => a.id !== heroArticle?.id && !secondaryFeatured.some((sf) => sf.id === a.id));
  const featuredArticles = [...secondaryFeatured, ...otherCandidates].slice(0, 6);

  // Latest articles (excluding hero and featured if plenty)
  const latestArticles = publishedArticles.filter(
    (a) => a.id !== heroArticle?.id && (selectedCategory === 'all' || a.categoryId === selectedCategory)
  );

  // Pagination calculation (Max 6 articles per page)
  const totalPages = Math.max(1, Math.ceil(latestArticles.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = latestArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('artikel-terbaru') || document.getElementById('naskah-terbaru');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Editorial Category Ticker / Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Semua Liputan
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400 shrink-0 pl-4">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>Insight Digital untuk Bisnis Indonesia</span>
        </div>
      </div>

      {/* Leaderboard Header Ad Slot */}
      <AdSlotBanner position="header_banner" className="my-6 max-w-5xl mx-auto" />

      {/* 1. HERO SECTION (Asymmetric Editorial Layout) */}
      {heroArticle && <HeroArticle article={heroArticle} />}

      {/* 2. FEATURED STORIES SECTION */}
      {featuredArticles.length > 0 && <FeaturedStories articles={featuredArticles} />}

      {/* 3. LATEST STORIES + POPULAR SIDEBAR */}
      <section className="my-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Column: Latest Stories Grid */}
          <div className="lg:col-span-8">
            <div id="artikel-terbaru" className="flex items-center justify-between pb-3 border-b-2 border-neutral-900 mb-6 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold font-serif-editorial text-neutral-900 tracking-tight flex items-center gap-2">
                <span>Artikel Terbaru</span>
                <span className="text-xs font-sans-ui text-neutral-500 font-normal">
                  ({latestArticles.length} artikel{totalPages > 1 ? ` • Hal. ${safePage}/${totalPages}` : ''})
                </span>
              </h2>

              <div className="text-xs text-neutral-400 font-mono-code uppercase tracking-wider">
                Kronologis
              </div>
            </div>

            {/* Editorial Grid: 2 columns desktop, 2 tablet, 1 mobile (Maksimal 6 artikel per halaman) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {paginatedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="grid" />
              ))}
            </div>

            {latestArticles.length === 0 && (
              <div className="py-16 text-center text-neutral-400 bg-white rounded-xl border border-neutral-200">
                Belum ada naskah untuk kategori ini.
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-neutral-500 font-sans-ui order-2 sm:order-1">
                  Menampilkan <span className="font-semibold text-neutral-800">{startIndex + 1}</span>–<span className="font-semibold text-neutral-800">{Math.min(startIndex + ITEMS_PER_PAGE, latestArticles.length)}</span> dari <span className="font-semibold text-neutral-800">{latestArticles.length}</span> naskah
                </div>

                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(safePage - 1)}
                    disabled={safePage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    aria-label="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = pageNum === safePage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                            isActive
                              ? 'bg-neutral-900 text-white shadow-xs'
                              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(safePage + 1)}
                    disabled={safePage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    aria-label="Halaman Berikutnya"
                  >
                    <span className="hidden sm:inline">Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column: Popular Stories & Curated Topics */}
          <div className="lg:col-span-4 space-y-8">
            {/* Numbered Popular Stories: 01, 02, 03, 04, 05 */}
            <PopularSidebar articles={publishedArticles} />

            {/* Sidebar Rectangle Showcase Ad Slot */}
            <AdSlotBanner position="sidebar_top" className="my-6" />

            {/* Curated Categories Box */}
            <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 mb-4">
                <Layers className="w-4 h-4 text-neutral-700" />
                <h3 className="text-base font-bold font-serif-editorial text-neutral-900">
                  Topik Trend Saat ini
                </h3>
              </div>

              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => goToCategory(cat.slug)}
                    className="w-full p-2.5 rounded-lg hover:bg-neutral-50 text-left flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-bold text-neutral-800 group-hover:text-red-600 transition-colors uppercase tracking-wider block">
                        {cat.name}
                      </span>
                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 group-hover:text-neutral-800 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In-Feed Native Editorial Sponsored Banner */}
      <AdSlotBanner position="article_in_feed" className="my-10" />

      {/* 4. NEWSLETTER SECTION */}
      <Newsletter />

      {/* Sticky Bottom Floating Bar Ad Slot */}
      <AdSlotBanner position="footer_banner" />
    </div>
  );
};
