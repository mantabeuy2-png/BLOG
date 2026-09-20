import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ChevronRight, Calendar, ArrowUpRight } from 'lucide-react';

export const ArchivePage: React.FC = () => {
  const { articles, goToHome, goToArticle, goToCategory } = useCms();
  const [selectedYear, setSelectedYear] = useState('2026');

  const published = articles.filter((a) => a.status === 'published');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-sans-ui">
        <button onClick={goToHome} className="hover:text-neutral-900">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <span className="text-neutral-900 font-semibold">Arsip Kronologis</span>
      </div>

      <div className="border-b-2 border-neutral-900 pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-1">
          Pustaka Penerbitan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-editorial text-neutral-900">
          Arsip Indeks Naskah
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Seluruh rekaman publikasi jurnalistik Newsroom tersusun secara kronologis.
        </p>
      </div>

      {/* Year Filter */}
      <div className="flex gap-2 mb-8">
        {['2026', '2025'].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              selectedYear === year
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            Tahun {year}
          </button>
        ))}
      </div>

      {/* List of articles */}
      <div className="space-y-4">
        {published.map((art) => (
          <div
            key={art.id}
            onClick={() => goToArticle(art.slug)}
            className="group cursor-pointer p-4 sm:p-5 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-400 hover:shadow-xs flex items-start justify-between gap-4 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-1">
                <span className="font-mono-code">{art.publishedAt}</span>
                <span>•</span>
                <span className="font-bold text-red-600 uppercase tracking-wider">{art.category}</span>
                <span>•</span>
                <span>{art.readingTime}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold font-serif-editorial text-neutral-900 group-hover:text-red-600 transition-colors">
                {art.title}
              </h3>

              <div className="mt-2 text-xs text-neutral-500">
                Ditulis oleh <span className="font-medium text-neutral-700">{art.author.name}</span>
              </div>
            </div>

            <div className="p-2 rounded-full bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
