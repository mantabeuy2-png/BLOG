import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Search, Bookmark, Menu, X, Shield, ChevronRight, User as UserIcon, LogOut } from 'lucide-react';
import { AuthModal } from '../shared/AuthModal';

export const Header: React.FC = () => {
  const {
    categories,
    menuItems,
    settings,
    currentUser,
    bookmarks,
    goToHome,
    goToCategory,
    goToSearch,
    goToAdmin,
    logout,
    openAuthModal
  } = useCms();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      goToSearch(searchQuery.trim());
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navCategories = categories.slice(0, 7);

  return (
    <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      {/* Top micro-bar: Date, weather/edition, admin switcher */}
      <div className="border-b border-neutral-100 px-4 sm:px-8 py-1.5 text-[11px] text-neutral-500 font-sans-ui flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium text-neutral-800">
            Sabtu, 19 September 2026
          </span>
          <span className="text-neutral-300">|</span>
          <span className="hidden sm:inline text-neutral-500 uppercase tracking-widest text-[10px]">
            EDISI DIGITAL BISNIS UMKM
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => goToAdmin('dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-[11px] transition-colors"
            title="Buka Panel CMS Redaksi"
          >
            <Shield className="w-3.5 h-3.5 text-red-600" />
            <span>CMS Admin</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline font-medium text-neutral-700">{currentUser.name}</span>
              <button
                onClick={logout}
                className="text-neutral-400 hover:text-red-600 p-0.5"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="hover:text-neutral-900 font-medium"
            >
              Masuk
            </button>
          )}
        </div>
      </div>

      {/* Main Bar: Logo, Navigation, Search, Auth */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={goToHome}
            className="text-left group flex items-baseline gap-1"
          >
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-editorial text-neutral-900">
              {settings.siteName}
            </span>
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block group-hover:scale-125 transition-transform" />
          </button>
        </div>

        {/* Desktop Dynamic Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <button
            onClick={goToHome}
            className="text-[13px] font-semibold tracking-wider uppercase text-neutral-900 hover:text-red-600 transition-colors"
          >
            Beranda
          </button>
          {navCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => goToCategory(cat.slug)}
              className="text-[13px] font-medium tracking-wider uppercase text-neutral-600 hover:text-neutral-900 hover:text-red-600 transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Right Tools: Search, Bookmarks, Sign In */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Trigger */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  autoFocus
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs bg-neutral-100 border border-neutral-300 rounded-full focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
                title="Cari"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bookmarks Counter */}
          <button
            onClick={() => goToSearch('bookmark')}
            className="relative p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            title="Daftar Simpanan"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Account Button / Register */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-200">
            {currentUser ? (
              <button
                onClick={() => goToAdmin('dashboard')}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-neutral-100 border border-neutral-200 transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-neutral-800">Meja Redaksi</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium">
                <button
                  onClick={openAuthModal}
                  className="px-3 py-1.5 text-neutral-700 hover:text-neutral-900"
                >
                  Masuk
                </button>
                <button
                  onClick={openAuthModal}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full font-semibold transition-colors shadow-xs"
                >
                  Langganan
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-6 py-6 animate-fade-in shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
              Kategori Liputan
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { goToHome(); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg bg-neutral-50 text-sm font-semibold text-neutral-900"
              >
                Beranda
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { goToCategory(cat.slug); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-neutral-50 text-sm font-medium text-neutral-700 flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-2">
              <button
                onClick={() => { goToAdmin('dashboard'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
              >
                <Shield className="w-4 h-4 text-red-500" />
                Masuk ke CMS Admin Redaksi
              </button>
              {!currentUser && (
                <button
                  onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 border border-neutral-300 text-neutral-800 rounded-lg text-xs font-semibold"
                >
                  Masuk / Daftar Akun
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
