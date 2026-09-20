import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { X, Upload, Check, Image as ImageIcon, Search } from 'lucide-react';
import { MediaItem } from '../../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Pilih Berkas Media'
}) => {
  const { media, addMedia, showToast } = useCms();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const filteredMedia = media.filter((m) =>
    (m.filename || m.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.altText || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    const item = media.find((m) => m.id === selectedId);
    if (item) {
      onSelect(item);
      onClose();
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const newItem = {
      filename: `media-${Date.now().toString().slice(-4)}.jpg`,
      url: newUrl,
      mimeType: 'image/jpeg',
      size: '1.2 MB',
      dimensions: '1920 x 1080 px',
      altText: newAlt || 'Gambar editorial artikel',
      caption: newCaption || ''
    };

    addMedia(newItem);
    setNewUrl('');
    setNewAlt('');
    setNewCaption('');
    setIsUploading(false);
    showToast('Gambar baru berhasil ditambahkan ke pustaka media', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-neutral-700" />
            <h3 className="font-bold text-neutral-900 text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari media atau teks alternatif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
            />
          </div>

          <button
            onClick={() => setIsUploading(!isUploading)}
            className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            {isUploading ? 'Tutup Formulir Unggah' : 'Unggah / Masukkan URL'}
          </button>
        </div>

        {/* Upload Drawer */}
        {isUploading && (
          <form onSubmit={handleQuickAdd} className="p-4 bg-neutral-100 border-b border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">URL Gambar (Unsplash / Langsung)</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">Teks Alternatif (ALT untuk SEO)</label>
              <input
                type="text"
                placeholder="Deskripsi detail gambar..."
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">Keterangan Gambar (Caption)</label>
              <input
                type="text"
                placeholder="Keterangan editorial..."
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors"
              >
                Simpan ke Pustaka
              </button>
            </div>
          </form>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredMedia.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`group relative cursor-pointer border rounded-lg overflow-hidden transition-all ${
                    isSelected ? 'ring-2 ring-neutral-900 border-transparent' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="aspect-4/3 bg-neutral-100 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.altText}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-[11px] font-medium text-neutral-800 truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate" title={item.altText}>
                      {item.altText || 'Tanpa ALT'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            {selectedId ? '1 gambar dipilih' : 'Pilih gambar dari daftar di atas'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-medium hover:bg-neutral-100"
            >
              Batal
            </button>
            <button
              disabled={!selectedId}
              onClick={handleSelect}
              className="px-5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Gunakan Gambar Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
