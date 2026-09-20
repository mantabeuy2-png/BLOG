import React from 'react';
import { CmsProvider, useCms } from './context/CmsContext';
import { Header } from './components/frontend/Header';
import { Footer } from './components/frontend/Footer';
import { ToastContainer } from './components/shared/ToastContainer';
import { AuthModal } from './components/shared/AuthModal';

import { HomePage } from './pages/frontend/HomePage';
import { ArticleDetailPage } from './pages/frontend/ArticleDetailPage';
import { CategoryPage } from './pages/frontend/CategoryPage';
import { SearchPage } from './pages/frontend/SearchPage';
import { AuthorPage } from './pages/frontend/AuthorPage';
import { TagPage } from './pages/frontend/TagPage';
import { ArchivePage } from './pages/frontend/ArchivePage';
import { StaticPage } from './pages/frontend/StaticPage';
import { AdminLayout } from './pages/admin/AdminLayout';

const AppContent: React.FC = () => {
  const { view, isAuthModalOpen, closeAuthModal } = useCms();

  // If in Admin Mode, render the full admin dashboard
  if (view.page === 'admin') {
    return (
      <>
        <AdminLayout />
        <ToastContainer />
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      </>
    );
  }

  // Frontend Views
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-neutral-900 font-sans-ui selection:bg-red-100 selection:text-red-900">
      <Header />

      <main className="flex-1">
        {view.page === 'home' && <HomePage />}
        {view.page === 'article' && <ArticleDetailPage slug={view.slug || ''} />}
        {view.page === 'category' && <CategoryPage slug={view.slug || ''} />}
        {view.page === 'search' && <SearchPage initialQuery={view.slug || ''} />}
        {view.page === 'author' && <AuthorPage slug={view.slug || ''} />}
        {view.page === 'tag' && <TagPage slug={view.slug || ''} />}
        {view.page === 'archive' && <ArchivePage />}
        {(view.page === 'static' || view.page === 'static-page') && (
          <StaticPage slug={view.slug || ''} />
        )}
      </main>

      <Footer />
      <ToastContainer />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};

export default function App() {
  return (
    <CmsProvider>
      <AppContent />
    </CmsProvider>
  );
}
