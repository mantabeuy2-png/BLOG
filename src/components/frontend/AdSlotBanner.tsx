import React, { useEffect, useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { AdPosition, AdSlot } from '../../types';
import { ExternalLink, Info, X } from 'lucide-react';

interface AdSlotBannerProps {
  position: AdPosition;
  className?: string;
  showLabel?: boolean;
}

export const AdSlotBanner: React.FC<AdSlotBannerProps> = ({
  position,
  className = '',
  showLabel = true
}) => {
  const { adSlots, recordAdImpression, recordAdClick } = useCms();
  const [isDismissed, setIsDismissed] = useState(false);

  // Find active ad for this position
  const activeAd: AdSlot | undefined = adSlots.find(
    (ad) => ad.position === position && ad.isActive
  );

  useEffect(() => {
    if (activeAd) {
      recordAdImpression(activeAd.id);
    }
  }, [activeAd?.id]);

  if (!activeAd || isDismissed) {
    return null;
  }

  const handleClick = () => {
    recordAdClick(activeAd.id);
  };

  // 1. Floating Bottom Banner
  if (position === 'footer_banner') {
    return (
      <aside aria-label="Iklan Sponsor Footer" className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-md text-white border-t border-neutral-700 shadow-2xl p-3 sm:p-4 animate-in fade-in slide-in-from-bottom duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-red-600/90 text-white shrink-0">
              Sponsor
            </span>
            <p className="text-xs sm:text-sm font-medium truncate text-neutral-200">
              {activeAd.altText || activeAd.title}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeAd.targetUrl && (
              <a
                href={activeAd.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="px-3.5 py-1.5 bg-white text-neutral-900 hover:bg-neutral-100 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Pelajari Lebih Lanjut</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => setIsDismissed(true)}
              className="text-neutral-400 hover:text-white p-1 rounded transition-colors"
              aria-label="Tutup Iklan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // 2. Native Sponsored Card / In-Feed Editorial Format
  if (activeAd.type === 'sponsored') {
    return (
      <aside aria-label="Konten Bersponsor" className={`my-8 p-5 sm:p-6 rounded-xl bg-neutral-50/90 border border-neutral-200/80 transition-all ${className}`}>
        {showLabel && (
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4 text-[11px] text-neutral-500 uppercase tracking-widest font-semibold font-sans-ui">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-neutral-400" />
              Konten Bersponsor
            </span>
            {activeAd.sponsorName && (
              <span className="text-neutral-700 font-bold">{activeAd.sponsorName}</span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {activeAd.imageUrl && (
            <div className="w-full sm:w-1/3 aspect-16/10 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
              <img
                src={activeAd.imageUrl}
                alt={activeAd.altText || activeAd.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <h4 className="font-serif-editorial text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
              {activeAd.title}
            </h4>
            {activeAd.altText && (
              <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2">
                {activeAd.altText}
              </p>
            )}
            {activeAd.targetUrl && (
              <a
                href={activeAd.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 pt-1"
              >
                <span>Kunjungi Mitra Kami</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </aside>
    );
  }

  // 3. Raw Code / Script Iklan (e.g. Google AdSense / Ad Exchange)
  if (activeAd.type === 'code' && activeAd.code) {
    return (
      <aside aria-label="Iklan Sponsor" className={`my-6 text-center ${className}`}>
        {showLabel && (
          <div className="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold pb-1.5">
            Advertisement
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{ __html: activeAd.code }}
          className="flex justify-center overflow-hidden"
        />
      </aside>
    );
  }

  // 4. Standard Image Banner (Leaderboard, Sidebar Rectangle, Bottom Banner)
  return (
    <aside aria-label="Iklan Sponsor" className={`my-6 text-center ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-center gap-2 pb-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
          <span>Advertisement</span>
          {activeAd.sponsorName && (
            <>
              <span>•</span>
              <span className="text-neutral-500 font-semibold">{activeAd.sponsorName}</span>
            </>
          )}
        </div>
      )}

      {activeAd.targetUrl ? (
        <a
          href={activeAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block group rounded-lg overflow-hidden border border-neutral-200/90 shadow-2xs hover:border-neutral-300 transition-all"
        >
          <img
            src={activeAd.imageUrl}
            alt={activeAd.altText || activeAd.title}
            className="w-full h-auto object-cover max-h-48 sm:max-h-64 mx-auto group-hover:opacity-95 transition-opacity"
          />
        </a>
      ) : (
        <div className="rounded-lg overflow-hidden border border-neutral-200 shadow-2xs">
          <img
            src={activeAd.imageUrl}
            alt={activeAd.altText || activeAd.title}
            className="w-full h-auto object-cover max-h-48 sm:max-h-64 mx-auto"
          />
        </div>
      )}
    </aside>
  );
};
