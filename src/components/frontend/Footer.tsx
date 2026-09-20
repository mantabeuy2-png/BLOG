import React from 'react';
import { useCms } from '../../context/CmsContext';
import { Shield, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories, staticPages, goToHome, goToCategory, goToPage, goToArchive, goToAdmin } = useCms();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 bg-white pt-14 pb-12 mt-16 font-sans-ui">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-100">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <button onClick={goToHome} className="text-left flex items-baseline gap-1">
              <span className="text-3xl font-bold font-serif-editorial tracking-tight text-neutral-900">
                {settings.siteName}
              </span>
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            </button>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm">
              {settings.footerDescription}
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-neutral-700">
              <a href={settings.twitter || '#'} target="_blank" rel="noreferrer" className="hover:text-red-600">Twitter/X</a>
              <a href={settings.instagram || '#'} target="_blank" rel="noreferrer" className="hover:text-red-600">Instagram</a>
              <a href={settings.linkedin || '#'} target="_blank" rel="noreferrer" className="hover:text-red-600">LinkedIn</a>
              <a href={settings.youtube || '#'} target="_blank" rel="noreferrer" className="hover:text-red-600">YouTube</a>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4">
              Kanal Liputan
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => goToCategory(cat.slug)}
                    className="hover:text-neutral-950 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial & Company Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4">
              Publikasi
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              {staticPages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => goToPage(page.slug)}
                    className="hover:text-neutral-950 transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={goToArchive}
                  className="hover:text-neutral-950 transition-colors"
                >
                  Indeks Arsip Berita
                </button>
              </li>
            </ul>
          </div>

          {/* Quick CMS Switcher */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4">
              Ruang Redaksi
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed mb-4">
              Kelola seluruh naskah, moderasi komentar pembaca, pustaka media, dan parameter SEO.
            </p>
            <button
              onClick={() => goToAdmin('dashboard')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Buka Dasbor CMS</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>{settings.copyrightText}</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors font-medium"
          >
            <span>Kembali ke atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
