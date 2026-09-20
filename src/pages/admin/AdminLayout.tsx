import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { AdminArticlesList } from './AdminArticlesList';
import { AdminArticleEditor } from './AdminArticleEditor';
import { AdminCategories } from './AdminCategories';
import { AdminTags } from './AdminTags';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminAuthors } from './AdminAuthors';
import { AdminComments } from './AdminComments';
import { AdminPages } from './AdminPages';
import { AdminMenuBuilder } from './AdminMenuBuilder';
import { AdminSeo } from './AdminSeo';
import { AdminSettings } from './AdminSettings';
import { AdminAds } from './AdminAds';
import { AdminUsers } from './AdminUsers';
import { ViewState } from '../../types';

export const AdminLayout: React.FC = () => {
  const { view, goToAdmin } = useCms();
  const subPage: NonNullable<ViewState['adminSubPage']> = view.adminSubPage || 'dashboard';
  const editingArticleId = view.slug;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const titles: Record<NonNullable<ViewState['adminSubPage']>, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dasbor Analitik & Redaksi',
      subtitle: 'Ringkasan lalu lintas pembaca, aktivitas penerbitan, dan antrean moderasi'
    },
    articles: {
      title: 'Manajemen Artikel',
      subtitle: 'Daftar publikasi, status naskah, dan metrik tayangan pembaca'
    },
    'article-editor': {
      title: editingArticleId ? 'Sunting Naskah' : 'Tulis Naskah Editorial Baru',
      subtitle: 'Komposisi konten kaya dengan pratinjau langsung dan pengaturan SEO terpadu'
    },
    categories: {
      title: 'Kanal & Rubrik Liputan',
      subtitle: 'Struktur kanal jurnalisme dan meta taksonomi situs'
    },
    tags: {
      title: 'Topik & Indeks Tagar',
      subtitle: 'Pengelompokan tematik untuk pencarian artikel lintas kanal'
    },
    media: {
      title: 'Pustaka Foto & Media',
      subtitle: 'Arsip foto resolusi tinggi, atribut aksesibilitas, dan optimasi web'
    },
    authors: {
      title: 'Dewan Redaksi & Penulis',
      subtitle: 'Profil jurnalis, biografi penulis, dan atribusi naskah'
    },
    comments: {
      title: 'Moderasi Komentar Pembaca',
      subtitle: 'Kurasi percakapan publik, filter spam, dan etika berpendapat'
    },
    pages: {
      title: 'Halaman Kebijakan & Statis',
      subtitle: 'Informasi institusional redaksi, pedoman etika, dan kontak'
    },
    menus: {
      title: 'Penataan Navigasi',
      subtitle: 'Kelola hierarki menu header dan footer portal'
    },
    seo: {
      title: 'Optimalisasi Mesin Pencari (SEO)',
      subtitle: 'Peta situs XML, schema terstruktur, robots.txt, dan kartu media sosial'
    },
    settings: {
      title: 'Konfigurasi Sistem Portal',
      subtitle: 'Identitas merek, palet warna editorial, dan hak cipta media'
    },
    ads: {
      title: 'Slot Iklan & Monetisasi Portal',
      subtitle: 'Kelola penempatan banner header, sidebar, sela naskah in-feed, dan pelacakan rasio klik (CTR)'
    },
    users: {
      title: 'Daftar Pengguna & Hak Akses',
      subtitle: 'Kelola akun pengguna, nama pengguna (username), email, foto profil, dan kata sandi akses sistem'
    }
  };

  const currentMeta = titles[subPage] || titles.dashboard;

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden font-sans-ui text-neutral-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar
          currentSubPage={subPage}
          onSelectSubPage={(p) => goToAdmin(p)}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 h-full">
            <AdminSidebar
              currentSubPage={subPage}
              onSelectSubPage={(p) => {
                goToAdmin(p);
                setMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-neutral-50/70">
          {subPage === 'dashboard' && <AdminDashboard />}
          {subPage === 'articles' && <AdminArticlesList />}
          {subPage === 'article-editor' && <AdminArticleEditor articleId={editingArticleId} />}
          {subPage === 'categories' && <AdminCategories />}
          {subPage === 'tags' && <AdminTags />}
          {subPage === 'media' && <AdminMediaLibrary />}
          {subPage === 'authors' && <AdminAuthors />}
          {subPage === 'comments' && <AdminComments />}
          {subPage === 'pages' && <AdminPages />}
          {subPage === 'menus' && <AdminMenuBuilder />}
          {subPage === 'ads' && <AdminAds />}
          {subPage === 'users' && <AdminUsers />}
          {subPage === 'seo' && <AdminSeo />}
          {subPage === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
