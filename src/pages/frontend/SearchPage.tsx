import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ArticleCard } from '../../components/frontend/ArticleCard';
import { Search, Filter, Bookmark, X } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '' }) => {
  const { articles, categories, authors, bookmarks } = useCms();
  const [query, setQuery] = useState(initialQuery === 'bookmark' ? '' : initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [onlyBookmarks, setOnlyBookmarks] = useState(initialQuery === 'bookmark');

  // Filter logic
  const filteredArticles = articles.filter((article) => {
    // Only published
    if (article.status !== 'published') return false;

    // Bookmarks toggle
    if (onlyBookmarks && !bookmarks.includes(article.id)) {
      return false;
    }

    // Text query match
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchExcerpt = article.excerpt.toLowerCase().includes(q);
      const matchCategory = article.category.toLowerCase().includes(q);
      const matchAuthor = article.author.name.toLowerCase().includes(q);
      const matchTag = article.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchExcerpt && !matchCategory && !matchAuthor && !matchTag) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'all' && article.categoryId !== selectedCategory && article.category !== selectedCategory) {
      return false;
    }

    // Author filter
    if (selectedAuthor !== 'all' && article.author.id !== selectedAuthor && article.author.name !== selectedAuthor) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
      {/* Header & Big Search Input */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-2">
          Pencarian Arsip Redaksi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-editorial text-neutral-900 tracking-tight mb-6">
          {onlyBookmarks ? 'Daftar Bacaan Tersimpan' : 'Cari Berita & Esai Terbitan'}
        </h1>

        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci, nama penulis, topik, atau frase..."
            className="w-full pl-12 pr-10 py-4 text-base sm:text-lg bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-900 shadow-xs font-sans-ui"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Author Filter */}
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
          >
            <option value="all">Semua Penulis</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bookmarks Toggle */}
        <button
          onClick={() => setOnlyBookmarks(!onlyBookmarks)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            onlyBookmarks
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>Hanya Simpanan ({bookmarks.length})</span>
        </button>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-6 text-xs text-neutral-500">
        <span>Menampilkan {filteredArticles.length} naskah ditemukan</span>
        {(query || selectedCategory !== 'all' || selectedAuthor !== 'all' || onlyBookmarks) && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
              setSelectedAuthor('all');
              setOnlyBookmarks(false);
            }}
            className="text-red-600 font-semibold hover:underline"
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="horizontal" />
        ))}

        {filteredArticles.length === 0 && (
          <div className="py-20 text-center bg-white rounded-xl border border-neutral-200">
            <p className="text-neutral-400 font-serif-editorial text-lg">
              Tidak ada artikel yang cocok dengan parameter pencarian Anda.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Cobalah menggunakan kata kunci yang lebih umum atau atur ulang opsi filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
