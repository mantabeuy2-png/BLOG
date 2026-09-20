import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Bookmark, MessageSquare } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

interface SocialShareProps {
  articleTitle: string;
  articleId: string;
  commentCount?: number;
  onScrollToComments?: () => void;
  orientation?: 'vertical' | 'horizontal';
}

export const SocialShare: React.FC<SocialShareProps> = ({
  articleTitle,
  articleId,
  commentCount = 0,
  onScrollToComments,
  orientation = 'horizontal'
}) => {
  const [copied, setCopied] = useState(false);
  const { toggleBookmark, isBookmarked, showToast } = useCms();
  const bookmarked = isBookmarked(articleId);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    showToast('Tautan artikel berhasil disalin ke papan klip', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Membaca "${articleTitle}" di Newsroom:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Membaca "${articleTitle}": ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleCopyLink}
          className="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-neutral-900 shadow-xs transition-colors"
          title="Salin Tautan"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
        </button>

        <button
          onClick={shareTwitter}
          className="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-neutral-900 shadow-xs transition-colors"
          title="Bagikan ke X"
        >
          <span className="text-xs font-bold font-sans">𝕏</span>
        </button>

        <button
          onClick={shareWhatsApp}
          className="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-neutral-900 shadow-xs transition-colors"
          title="Bagikan ke WhatsApp"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => toggleBookmark(articleId)}
          className={`w-10 h-10 rounded-full border shadow-xs flex items-center justify-center transition-colors ${
            bookmarked
              ? 'bg-red-50 text-red-600 border-red-200'
              : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
          }`}
          title={bookmarked ? 'Hapus Simpanan' : 'Simpan Artikel'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {onScrollToComments && (
          <button
            onClick={onScrollToComments}
            className="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 relative shadow-xs"
            title="Komentar"
          >
            <MessageSquare className="w-4 h-4" />
            {commentCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-neutral-900 text-white text-[9px] font-bold rounded-full">
                {commentCount}
              </span>
            )}
          </button>
        )}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mr-2">
        Bagikan
      </span>

      <button
        onClick={handleCopyLink}
        className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <LinkIcon className="w-3.5 h-3.5 text-neutral-400" />}
        <span>{copied ? 'Tersalin' : 'Salin'}</span>
      </button>

      <button
        onClick={shareTwitter}
        className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <span className="text-xs font-bold">𝕏</span>
        <span>Twitter</span>
      </button>

      <button
        onClick={shareWhatsApp}
        className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <Share2 className="w-3.5 h-3.5 text-neutral-400" />
        <span>WhatsApp</span>
      </button>

      <button
        onClick={shareLinkedIn}
        className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <span>LinkedIn</span>
      </button>

      <button
        onClick={() => toggleBookmark(articleId)}
        className={`ml-auto px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
          bookmarked
            ? 'bg-red-50 text-red-600 border-red-200'
            : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
        }`}
      >
        <Bookmark className="w-3.5 h-3.5 fill-current" />
        <span>{bookmarked ? 'Tersimpan' : 'Simpan Naskah'}</span>
      </button>
    </div>
  );
};
