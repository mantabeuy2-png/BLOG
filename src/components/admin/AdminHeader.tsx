import React from 'react';
import { useCms } from '../../context/CmsContext';
import { Bell, ExternalLink, Globe, Search } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, onOpenMobileSidebar }) => {
  const { settings, goToHome, comments } = useCms();
  const pendingCommentsCount = comments.filter((c) => c.status === 'pending').length;

  return (
    <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-4">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs"
          >
            Menu
          </button>
        )}
        <div>
          <h1 className="text-lg font-bold text-neutral-900 leading-tight font-sans-ui">{title}</h1>
          {subtitle && <p className="text-xs text-neutral-500 font-sans-ui">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Site Shortcut */}
        <button
          onClick={goToHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-500" />
          <span>Lihat Website</span>
          <ExternalLink className="w-3 h-3 text-neutral-400" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <div className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
            {pendingCommentsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
