import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Search, Globe, Code, CheckCircle, Copy, Check, Sparkles, Share2 } from 'lucide-react';

export const AdminSeo: React.FC = () => {
  const { settings, articles, categories, showToast } = useCms();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'sitemap' | 'schema' | 'robots'>('overview');
  const [copied, setCopied] = useState(false);

  // Generate XML Sitemap preview
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Site URL -->
  <url>
    <loc>https://newsroom.id/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Category Channels -->
${categories
  .map(
    (c) => `  <url>
    <loc>https://newsroom.id/category/${c.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
  <!-- Articles Index -->
${articles
  .filter((a) => a.status === 'published')
  .map(
    (a) => `  <url>
    <loc>https://newsroom.id/article/${a.slug}</loc>
    <lastmod>${a.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  // Generate JSON-LD Schema
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: settings.siteName,
    url: 'https://newsroom.id',
    logo: {
      '@type': 'ImageObject',
      url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'
    },
    sameAs: [
      settings.twitter || 'https://twitter.com',
      settings.instagram || 'https://instagram.com',
      settings.linkedin || 'https://linkedin.com'
    ],
    description: settings.siteDescription
  };

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://newsroom.id/sitemap.xml`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopied(true);
    showToast('Teks berhasil disalin ke papan klip', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      <div>
        <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
          Optimalisasi Mesin Pencari (SEO) & Sitemap
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Kelola metadata indeks Google, peta situs XML dinamis, Schema.org NewsArticle, dan pratinjau kartu OpenGraph.
        </p>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSubTab === 'overview'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Ringkasan Kesehatan SEO
        </button>
        <button
          onClick={() => setActiveSubTab('sitemap')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSubTab === 'sitemap'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Peta Situs XML (sitemap.xml)
        </button>
        <button
          onClick={() => setActiveSubTab('schema')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSubTab === 'schema'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Skema Terstruktur (JSON-LD)
        </button>
        <button
          onClick={() => setActiveSubTab('robots')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSubTab === 'robots'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Robots.txt
        </button>
      </div>

      {/* Content based on subtab */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checklist */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 pb-2 border-b border-neutral-100">
              Daftar Kepatuhan SEO Teknis
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">Peta Situs XML Dinamis Aktif</h4>
                  <p className="text-neutral-600 mt-0.5 leading-relaxed">
                    Sitemap memperbarui otomatis seluruh artikel yang berstatus "published".
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">Struktur Data Schema.org Terpasang</h4>
                  <p className="text-neutral-600 mt-0.5 leading-relaxed">
                    Didukung format NewsArticle & NewsMediaOrganization untuk Google News dan Carousel.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">Robots.txt Mengamankan Panel Admin</h4>
                  <p className="text-neutral-600 mt-0.5 leading-relaxed">
                    Perayap mesin pencari diinstruksikan untuk tidak mengindeks /admin/ dan rute internal.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">Kepatuhan Tag Kanonikal Otomatis</h4>
                  <p className="text-neutral-600 mt-0.5 leading-relaxed">
                    Mencegah duplikasi konten antar-kategori dengan penetapan canonical URL permanen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Share2 className="w-4 h-4 text-neutral-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                Pratinjau Kartu Berbagi Sosial (OpenGraph)
              </h3>
            </div>

            <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-xs">
              <div className="aspect-16/9 bg-neutral-200 overflow-hidden">
                <img
                  src={articles[0]?.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-xs">
                <span className="text-[10px] uppercase font-mono-code text-neutral-400 block">
                  NEWSROOM.ID
                </span>
                <h4 className="font-bold text-neutral-900 mt-0.5 truncate">
                  {articles[0]?.title || 'Judul Artikel Utama'}
                </h4>
                <p className="text-neutral-500 line-clamp-2 mt-1 text-[11px]">
                  {articles[0]?.excerpt || 'Ringkasan narasi liputan editorial berkualitas tinggi.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'sitemap' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-mono-code">/sitemap.xml</h3>
              <p className="text-xs text-neutral-500">Peta situs yang otomatis dibaca oleh Googlebot</p>
            </div>
            <button
              onClick={() => copyToClipboard(sitemapXml)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin XML'}</span>
            </button>
          </div>

          <pre className="p-4 bg-neutral-950 text-neutral-300 rounded-lg text-xs font-mono-code overflow-x-auto max-h-[450px]">
            {sitemapXml}
          </pre>
        </div>
      )}

      {activeSubTab === 'schema' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Schema.org JSON-LD (NewsMediaOrganization)</h3>
              <p className="text-xs text-neutral-500">Metadata data terstruktur untuk fitur rich snippet Google</p>
            </div>
            <button
              onClick={() => copyToClipboard(JSON.stringify(jsonLdSchema, null, 2))}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin Skema</span>
            </button>
          </div>

          <pre className="p-4 bg-neutral-950 text-neutral-300 rounded-lg text-xs font-mono-code overflow-x-auto">
            {JSON.stringify(jsonLdSchema, null, 2)}
          </pre>
        </div>
      )}

      {activeSubTab === 'robots' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-mono-code">/robots.txt</h3>
              <p className="text-xs text-neutral-500">Konfigurasi arahan perayapan mesin pencari</p>
            </div>
            <button
              onClick={() => copyToClipboard(robotsTxt)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin Teks</span>
            </button>
          </div>

          <pre className="p-4 bg-neutral-950 text-neutral-300 rounded-lg text-xs font-mono-code overflow-x-auto">
            {robotsTxt}
          </pre>
        </div>
      )}
    </div>
  );
};
