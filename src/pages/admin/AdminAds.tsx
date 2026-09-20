import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { AdPosition, AdSlot, AdType, MediaItem } from '../../types';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MousePointerClick,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
  Image as ImageIcon,
  Code,
  Calendar,
  Search
} from 'lucide-react';
import { MediaPickerModal } from '../../components/shared/MediaPickerModal';

export const AdminAds: React.FC = () => {
  const { adSlots, saveAdSlot, deleteAdSlot, toggleAdSlotStatus, showToast } = useCms();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<AdSlot> | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState<AdPosition>('header_banner');
  const [type, setType] = useState<AdType>('image');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [code, setCode] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  // Position Labels & Guide
  const positionLabels: Record<AdPosition, { label: string; recommended: string; desc: string }> = {
    header_banner: {
      label: 'Leaderboard Header',
      recommended: '970x90 / 728x90 px',
      desc: 'Tampil di bagian atas portal tepat di bawah bilah navigasi utama'
    },
    sidebar_top: {
      label: 'Sidebar Atas (Medium Rectangle)',
      recommended: '300x250 / 336x280 px',
      desc: 'Tampil di kolom samping artikel dan halaman depan sebelum daftar artikel terpopuler'
    },
    article_in_feed: {
      label: 'Sela Konten Naskah (In-Feed)',
      recommended: 'Responsive Banner / Advertorial',
      desc: 'Tampil secara natural di antara paragraf teks bacaan artikel editorial'
    },
    article_bottom: {
      label: 'Bawah Naskah Artikel',
      recommended: '728x90 / Responsive px',
      desc: 'Tampil tepat setelah naskah artikel selesai sebelum blok komentar pembaca'
    },
    footer_banner: {
      label: 'Floating Bottom Bar (Sticky)',
      recommended: '1200x50 / Full Width px',
      desc: 'Bilah mengambang di bawah layar dengan tombol tutup ramah pembaca'
    }
  };

  // Metrics Calculations
  const totalImpressions = adSlots.reduce((acc, curr) => acc + (curr.impressions || 0), 0);
  const totalClicks = adSlots.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const activeCount = adSlots.filter((a) => a.isActive).length;

  // Filter list
  const filteredAds = adSlots.filter((ad) => {
    if (filterPosition !== 'all' && ad.position !== filterPosition) return false;
    if (filterStatus === 'active' && !ad.isActive) return false;
    if (filterStatus === 'inactive' && ad.isActive) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ad.title.toLowerCase().includes(q) ||
        (ad.sponsorName && ad.sponsorName.toLowerCase().includes(q)) ||
        (ad.altText && ad.altText.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingAd(null);
    setTitle('');
    setPosition('header_banner');
    setType('image');
    setImageUrl('');
    setTargetUrl('');
    setAltText('');
    setCode('');
    setSponsorName('');
    setIsActive(true);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad: AdSlot) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setPosition(ad.position);
    setType(ad.type);
    setImageUrl(ad.imageUrl || '');
    setTargetUrl(ad.targetUrl || '');
    setAltText(ad.altText || '');
    setCode(ad.code || '');
    setSponsorName(ad.sponsorName || '');
    setIsActive(ad.isActive);
    setStartDate(ad.startDate || '');
    setEndDate(ad.endDate || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Judul slot iklan wajib diisi', 'error');
      return;
    }

    if (type === 'image' && !imageUrl.trim()) {
      showToast('URL Gambar banner wajib diisi atau dipilih dari pustaka', 'error');
      return;
    }

    saveAdSlot({
      id: editingAd?.id,
      title: title.trim(),
      position,
      type,
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl.trim(),
      altText: altText.trim(),
      code: code.trim(),
      sponsorName: sponsorName.trim(),
      isActive,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || undefined,
      impressions: editingAd?.impressions ?? 0,
      clicks: editingAd?.clicks ?? 0
    });

    setIsModalOpen(false);
  };

  const handleSelectMedia = (item: MediaItem) => {
    setImageUrl(item.url);
    if (!altText && item.altText) {
      setAltText(item.altText);
    }
    showToast('Gambar berhasil dipilih dari Pustaka Media', 'success');
  };

  return (
    <div className="space-y-8 font-sans-ui">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Slot Terdaftar</span>
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-700">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-code text-neutral-900">{adSlots.length}</span>
            <span className="text-xs text-neutral-500">slot</span>
          </div>
          <p className="text-[11px] text-neutral-400">Termasuk banner header, sidebar, in-feed, dan bottom bar</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Kampanye Aktif</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-code text-emerald-600">{activeCount}</span>
            <span className="text-xs text-neutral-500">dari {adSlots.length} slot</span>
          </div>
          <p className="text-[11px] text-neutral-400">Iklan yang sedang live dan dapat dilihat oleh pembaca</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tayangan (Impresi)</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-code text-neutral-900">
              {totalImpressions.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-neutral-500">kali tayang</span>
          </div>
          <p className="text-[11px] text-neutral-400">Total impresi iklan yang terukur di seluruh portal</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Rata-rata CTR (Rasio Klik)</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-code text-red-600">{overallCtr}%</span>
            <span className="text-xs text-neutral-500">({totalClicks.toLocaleString('id-ID')} klik)</span>
          </div>
          <p className="text-[11px] text-neutral-400">Efektivitas konversi klik mitra pengiklan</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-2xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-neutral-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari nama iklan atau sponsor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>

            {/* Position Filter */}
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
            >
              <option value="all">Semua Posisi Penempatan</option>
              <option value="header_banner">Leaderboard Header</option>
              <option value="sidebar_top">Sidebar Atas</option>
              <option value="article_in_feed">In-Feed (Sela Naskah)</option>
              <option value="article_bottom">Bawah Naskah</option>
              <option value="footer_banner">Floating Bottom Bar</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
            >
              <option value="all">Semua Status</option>
              <option value="active">Sedang Tayang (Aktif)</option>
              <option value="inactive">Nonaktif (Dijeda)</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Slot Iklan</span>
          </button>
        </div>

        {/* Ad Slots Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Pratinjau Banner</th>
                <th className="py-3.5 px-4">Informasi Slot & Pengiklan</th>
                <th className="py-3.5 px-4">Posisi Penempatan</th>
                <th className="py-3.5 px-4">Tipe Format</th>
                <th className="py-3.5 px-4 text-center">Status Tayang</th>
                <th className="py-3.5 px-4 text-right">Impresi / Klik (CTR)</th>
                <th className="py-3.5 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredAds.map((ad) => {
                const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={ad.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Visual Banner Thumbnail */}
                    <td className="py-3.5 px-4 w-36">
                      {ad.imageUrl ? (
                        <div className="w-28 h-12 rounded bg-neutral-100 border border-neutral-200 overflow-hidden relative group">
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-12 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-[10px]">
                          <Code className="w-4 h-4" />
                        </div>
                      )}
                    </td>

                    {/* Ad Title & Sponsor */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-neutral-900 line-clamp-1">{ad.title}</div>
                      {ad.sponsorName && (
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <span className="text-neutral-400">Sponsor:</span>
                          <span className="font-medium text-neutral-700">{ad.sponsorName}</span>
                        </div>
                      )}
                      {ad.targetUrl && (
                        <a
                          href={ad.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-red-600 hover:underline flex items-center gap-1 mt-0.5 truncate"
                        >
                          <span className="truncate">{ad.targetUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      )}
                    </td>

                    {/* Position Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-800 font-medium text-[11px]">
                        {positionLabels[ad.position]?.label || ad.position}
                      </span>
                    </td>

                    {/* Ad Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-700">
                        {ad.type === 'image' && 'Banner Gambar'}
                        {ad.type === 'sponsored' && 'Advertorial Naskah'}
                        {ad.type === 'code' && 'Kode Skrip HTML'}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleAdSlotStatus(ad.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          ad.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                        }`}
                        title="Klik untuk mengubah status tayang iklan"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${ad.isActive ? 'bg-emerald-600' : 'bg-neutral-400'}`} />
                        <span>{ad.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </button>
                    </td>

                    {/* Impressions & CTR */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="font-mono-code font-bold text-neutral-900">
                        {ad.impressions.toLocaleString('id-ID')} imp.
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        <span className="font-mono-code text-red-600 font-semibold">{ad.clicks} klik</span>
                        <span className="text-neutral-400"> ({ctr}% CTR)</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(ad)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                          title="Sunting Slot Iklan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Yakin ingin menghapus slot iklan "${ad.title}"?`)) {
                              deleteAdSlot(ad.id);
                            }
                          }}
                          className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Hapus Slot Iklan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAds.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-neutral-400">
                    <Megaphone className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <p className="text-sm font-medium">Tidak ada slot iklan ditemukan.</p>
                    <p className="text-xs text-neutral-500 mt-1">Coba sesuaikan filter pencarian atau buat slot iklan baru.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Placement Guide */}
      <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-neutral-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Panduan Zona Penempatan Slot Iklan di Redaksi
          </h3>
        </div>
        <p className="text-xs text-neutral-600 mb-4 max-w-2xl">
          Setiap slot iklan telah dirancang proporsional sesuai estetika majalah editorial premium tanpa merusak kenyamanan membaca pengunjung.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
            <span className="font-bold text-neutral-900 block">1. Leaderboard Header</span>
            <p className="text-neutral-500 text-[11px]">Rekomendasi: 970×90 atau 728×90 px.</p>
            <p className="text-neutral-600 text-[11px]">Memaksimalkan visibilitas merek bagi semua pengunjung yang pertama kali mendarat di portal.</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
            <span className="font-bold text-neutral-900 block">2. In-Feed Native & Sidebar</span>
            <p className="text-neutral-500 text-[11px]">Rekomendasi: 300×250 px / Advertorial.</p>
            <p className="text-neutral-600 text-[11px]">Tampil berdampingan dengan daftar artikel populer atau di tengah paragraf bacaan mendalam.</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-1">
            <span className="font-bold text-neutral-900 block">3. Bottom & Floating Bar</span>
            <p className="text-neutral-500 text-[11px]">Rekomendasi: 1200×60 px / Full Width.</p>
            <p className="text-neutral-600 text-[11px]">Menjangkau pembaca yang telah menyelesaikan artikel secara tuntas (konversi tinggi).</p>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit Ad Slot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif-editorial text-xl font-bold text-neutral-900">
                  {editingAd ? 'Sunting Slot Iklan & Penempatan' : 'Tambah Slot Iklan Baru'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Konfigurasi posisi tampilan, format materi iklan, dan mitra pengiklan
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
              {/* Title & Sponsor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1 text-[11px]">
                    Nama Slot / Judul Iklan *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="misal: Header Leaderboard Bank Mandiri"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1 text-[11px]">
                    Nama Sponsor / Pengiklan
                  </label>
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="misal: PT Bank Mandiri (Persero)"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Position & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1 text-[11px]">
                    Posisi Penempatan *
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as AdPosition)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  >
                    <option value="header_banner">Leaderboard Header (Atas)</option>
                    <option value="sidebar_top">Sidebar Atas (Samping Artikel)</option>
                    <option value="article_in_feed">Sela Naskah (In-Feed Paragraf)</option>
                    <option value="article_bottom">Bawah Naskah (Sebelum Komentar)</option>
                    <option value="footer_banner">Floating Bottom Bar (Sticky Footer)</option>
                  </select>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Ukuran disarankan: {positionLabels[position]?.recommended}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1 text-[11px]">
                    Format Materi Iklan *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AdType)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  >
                    <option value="image">Banner Gambar & URL Tautan</option>
                    <option value="sponsored">Advertorial / Konten Bersponsor</option>
                    <option value="code">Kode Skrip HTML / Google AdSense</option>
                  </select>
                </div>
              </div>

              {/* Image Banner Fields */}
              {type !== 'code' ? (
                <div className="space-y-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold uppercase tracking-wider text-neutral-700 text-[11px]">
                        URL Gambar Banner *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="text-red-600 hover:text-red-700 font-semibold text-[11px] flex items-center gap-1"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Pilih dari Pustaka Media</span>
                      </button>
                    </div>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... (atau pilih dari Pustaka Media)"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 font-mono-code"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1 text-[11px]">
                      URL Target Tautan (Klik Menuju)
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://pengiklan.com/promo-khusus"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 font-mono-code"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1 text-[11px]">
                      Teks Alt Banner / Pesan Iklan
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Penjelasan ringkas pesan iklan untuk aksesibilitas & SEO"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  {/* Live Banner Preview in Modal */}
                  {imageUrl && (
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                        Pratinjau Materi Iklan:
                      </span>
                      <div className="rounded-lg overflow-hidden border border-neutral-300 bg-white max-h-36">
                        <img
                          src={imageUrl}
                          alt={altText || 'Pratinjau'}
                          className="w-full h-auto object-cover max-h-36 mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <label className="block font-semibold uppercase tracking-wider text-neutral-700 text-[11px]">
                    Kode HTML / Skrip AdSense
                  </label>
                  <textarea
                    rows={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="<ins class='adsbygoogle' ...></ins><script>...</script>"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 font-mono-code text-xs"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Masukkan tag skrip atau kode embed responsif yang disediakan oleh jaringan periklanan.
                  </p>
                </div>
              )}

              {/* Schedule Dates & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1 text-[11px]">
                    Tanggal Mulai Tayang
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1 text-[11px]">
                    Tanggal Selesai (Opsional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="font-semibold text-neutral-800 text-xs">Aktifkan Penayangan</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  {editingAd ? 'Simpan Perubahan' : 'Buat Slot Iklan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectMedia}
        title="Pilih Materi Gambar Banner dari Pustaka Media"
      />
    </div>
  );
};
