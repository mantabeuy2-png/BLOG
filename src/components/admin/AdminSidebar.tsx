import React from 'react';
import { useCms } from '../../context/CmsContext';
import { ViewState } from '../../types';
import { AgenxLogo } from '../shared/AgenxLogo';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image as ImageIcon,
  Users,
  MessageSquare,
  FileCode,
  Menu as MenuIcon,
  Search,
  Settings,
  ExternalLink,
  PlusCircle,
  LogOut,
  Sparkles,
  Megaphone,
  UserCheck
} from 'lucide-react';

interface AdminSidebarProps {
  currentSubPage: ViewState['adminSubPage'];
  onSelectSubPage: (subPage: NonNullable<ViewState['adminSubPage']>) => void;
}

interface NavItem {
  id: NonNullable<ViewState['adminSubPage']>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentSubPage = 'dashboard', onSelectSubPage }) => {
  const { settings, currentUser, users, goToHome, logout, goToAdmin } = useCms();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dasbor Analitik', icon: LayoutDashboard },
    { id: 'articles', label: 'Artikel & Naskah', icon: FileText, badge: 'Kelola' },
    { id: 'categories', label: 'Kategori Liputan', icon: FolderTree },
    { id: 'tags', label: 'Topik & Tagar', icon: Tags },
    { id: 'media', label: 'Pustaka Media', icon: ImageIcon },
    { id: 'users', label: 'Daftar Pengguna', icon: UserCheck, badge: `${users.length}` },
    { id: 'authors', label: 'Penulis & Editor', icon: Users },
    { id: 'comments', label: 'Moderasi Komentar', icon: MessageSquare },
    { id: 'pages', label: 'Halaman Statis', icon: FileCode },
    { id: 'menus', label: 'Menu Navigasi', icon: MenuIcon },
    { id: 'ads', label: 'Slot Iklan & Banner', icon: Megaphone, badge: 'Monetisasi' },
    { id: 'seo', label: 'SEO & Sitemap', icon: Search },
    { id: 'settings', label: 'Pengaturan Situs', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-neutral-950 text-neutral-300 flex flex-col h-screen shrink-0 border-r border-neutral-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-neutral-700/50">
            <AgenxLogo className="w-full h-full" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight font-serif-editorial text-base block leading-tight">
              {settings.siteName}
            </span>
            <span className="inline-block text-[10px] font-mono-code font-semibold uppercase tracking-wider text-neutral-300 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 mt-0.5">
              AGENX CMS V1.2
            </span>
          </div>
        </div>

        <button
          onClick={goToHome}
          className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Buka Halaman Depan Website"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action: New Post */}
      <div className="p-4">
        <button
          onClick={() => goToAdmin('article-editor')}
          className="w-full py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Naskah Baru</span>
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSubPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSubPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono-code">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-neutral-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
              AD
            </div>
          )}
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate leading-tight">
              {currentUser?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-neutral-500 capitalize">{currentUser?.role || 'Admin Redaksi'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
          title="Keluar"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
