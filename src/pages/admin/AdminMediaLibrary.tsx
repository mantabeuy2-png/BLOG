import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { MediaItem } from '../../types';
import {
  Search,
  Upload,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Video,
  Info,
  ExternalLink
} from 'lucide-react';

export const AdminMediaLibrary: React.FC = () => {
  const { mediaItems, addMediaItem, deleteMediaItem, showToast } = useCms();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(mediaItems[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New media modal/inputs
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAlt, setNewAlt] = useState('');

  const filtered = mediaItems.filter((item: MediaItem) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const title = item.title || item.filename || '';
      const fname = item.fileName || item.filename || '';
      const alt = item.altText || '';
      return (
        title.toLowerCase().includes(q) ||
        fname.toLowerCase().includes(q) ||
        alt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText?.(url);
    setCopiedId(id);
    showToast('Tautan media disalin ke papan klip', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) return;

    addMediaItem({
      title: newTitle,
      url: newUrl,
      fileName: newTitle.toLowerCase().replace(/\s+/g, '-') + '.jpg',
      fileSize: '420 KB',
      dimensions: '1920x1080',
      type: 'image',
      altText: newAlt || newTitle,
      caption: newTitle
    });

    setNewUrl('');
    setNewTitle('');
    setNewAlt('');
    setShowUploadModal(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
            Pustaka Media Berita
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola foto jurnalistik, ilustrasi grafis, dokumen lampiran, dan atribut Alt Text SEO.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Tambah Berkas Media</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama berkas, teks alt..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="flex gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs font-medium">
            {(['all', 'image', 'video', 'document'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded capitalize transition-colors ${
                  filterType === t
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {t === 'all' ? 'Semua' : t === 'image' ? 'Foto' : t === 'video' ? 'Video' : 'Dokumen'}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-neutral-400 font-mono-code">
          {filtered.length} berkas ditampilkan
        </span>
      </div>

      {/* Media Grid and Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Media Grid */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((item: MediaItem) => {
              const isSelected = selectedMedia?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className={`group relative aspect-square rounded-lg overflow-hidden bg-neutral-100 border cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-neutral-900 border-transparent' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.altText || item.title || 'Foto Media'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                    <span className="text-[10px] truncate font-semibold">{item.title || item.filename}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(item.url, item.id);
                      }}
                      className="p-1 rounded bg-black/60 hover:bg-black text-white self-end text-xs"
                      title="Salin URL"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-neutral-400">
                Tidak ada berkas media ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* Selected Media Details Inspector */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 pb-2 border-b border-neutral-100">
            Rincian Berkas Terpilih
          </h3>

          {selectedMedia ? (
            <div className="space-y-4">
              <div className="aspect-16/10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title || selectedMedia.filename}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-neutral-500 block">Nama Berkas:</span>
                  <span className="font-mono-code text-neutral-900 break-all">{selectedMedia.fileName || selectedMedia.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-500">Dimensi:</span>
                  <span className="font-mono-code text-neutral-800">{selectedMedia.dimensions || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-500">Ukuran:</span>
                  <span className="font-mono-code text-neutral-800">{selectedMedia.fileSize || selectedMedia.size || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-500">Tanggal Unggah:</span>
                  <span className="font-mono-code text-neutral-800">{selectedMedia.uploadedAt}</span>
                </div>
              </div>

              {/* Alt Text field (critical for SEO) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Teks Alt (SEO & Aksesibilitas)
                </label>
                <input
                  type="text"
                  value={selectedMedia.altText}
                  onChange={(e) => {
                    setSelectedMedia({ ...selectedMedia, altText: e.target.value });
                  }}
                  placeholder="Deskripsi visual untuk mesin pencari..."
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 bg-neutral-50"
                />
              </div>

              {/* URL Copy */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">URL Publik:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedMedia.url}
                    className="flex-1 px-3 py-1.5 text-[11px] font-mono-code bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-600 truncate"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedMedia.url, selectedMedia.id)}
                    className="p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700"
                    title="Salin Tautan"
                  >
                    {copiedId === selectedMedia.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Delete media */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    deleteMediaItem(selectedMedia.id);
                    setSelectedMedia(null);
                  }}
                  className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus dari Pustaka Media</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 py-8 text-center">
              Pilih salah satu berkas di sebelah kiri untuk melihat rincian.
            </p>
          )}
        </div>
      </div>

      {/* Upload Media Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold font-serif-editorial text-neutral-900">
              Tambah Berkas Media Baru
            </h3>

            <form onSubmit={handleAddMedia} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Judul / Label Foto</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Gedung Bursa Efek Jakarta Siang Hari"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">URL Sumber Gambar</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none font-mono-code text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Alt Text (SEO)</label>
                <input
                  type="text"
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  placeholder="Deskripsi untuk pembaca tuna netra & bot Google"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg"
                >
                  Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
