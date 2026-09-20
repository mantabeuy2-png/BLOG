import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Search,
  Plus,
  Edit2,
  Copy,
  Eye,
  Trash2,
  CheckSquare,
  Square,
  Filter,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { Article } from '../../types';

export const AdminArticlesList: React.FC = () => {
  const {
    articles,
    goToAdmin,
    goToArticle,
    duplicateArticle,
    deleteArticle,
    saveArticle,
    showToast
  } = useCms();

  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'scheduled' | 'trash'>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter articles
  const filtered = articles.filter((a) => {
    if (activeTab !== 'all' && a.status !== activeTab) return false;
    if (categoryFilter !== 'all' && a.categoryId !== categoryFilter && a.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkTrash = () => {
    selectedIds.forEach((id) => deleteArticle(id, activeTab === 'trash'));
    setSelectedIds([]);
    showToast(`${selectedIds.length} artikel telah diperbarui`, 'info');
  };

  const handleBulkPublish = () => {
    selectedIds.forEach((id) => {
      const art = articles.find((a) => a.id === id);
      if (art) saveArticle({ ...art, status: 'published' });
    });
    setSelectedIds([]);
    showToast(`${selectedIds.length} artikel berhasil diterbitkan`, 'success');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
            Manajemen Naskah Editorial
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Total {articles.length} naskah terdaftar dalam sistem penerbitan.
          </p>
        </div>

        <button
          onClick={() => goToAdmin('article-editor')}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Artikel Baru</span>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 pt-3 overflow-x-auto">
          <div className="flex gap-6 text-xs font-semibold">
            {(['all', 'published', 'draft', 'scheduled', 'trash'] as const).map((tab) => {
              const count = tab === 'all' ? articles.length : articles.filter((a) => a.status === tab).length;
              const labels = {
                all: 'Semua',
                published: 'Terbit',
                draft: 'Draf',
                scheduled: 'Terjadwal',
                trash: 'Sampah'
              };
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedIds([]);
                  }}
                  className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab
                      ? 'border-red-600 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <span>{labels[tab]}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-neutral-100 text-[10px] text-neutral-600">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Search & Bulk actions */}
        <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul artikel, kategori, penulis..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
            />
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-neutral-700">{selectedIds.length} dipilih:</span>
              <button
                onClick={handleBulkPublish}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium"
              >
                Terbitkan
              </button>
              <button
                onClick={handleBulkTrash}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
              >
                {activeTab === 'trash' ? 'Hapus Permanen' : 'Buang ke Sampah'}
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100/60 text-neutral-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-10">
                  <button onClick={toggleSelectAll} className="flex items-center">
                    {allSelected ? (
                      <CheckSquare className="w-4 h-4 text-neutral-900" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 w-16">Gambar</th>
                <th className="py-3 px-4">Judul Naskah</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Penulis</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Tayangan</th>
                <th className="py-3 px-4">Tanggal Rilis</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((art) => {
                const isSelected = selectedIds.includes(art.id);
                return (
                  <tr
                    key={art.id}
                    className={`hover:bg-neutral-50/80 transition-colors ${
                      isSelected ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <button onClick={() => toggleSelectOne(art.id)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-neutral-900" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <div className="w-12 h-8 rounded bg-neutral-200 overflow-hidden shrink-0">
                        <img
                          src={art.featuredImage}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-neutral-900 max-w-xs">
                      <button
                        onClick={() => goToAdmin('article-editor', art.id)}
                        className="hover:text-red-600 transition-colors text-left line-clamp-1"
                        title={art.title}
                      >
                        {art.title}
                      </button>
                      <span className="text-[10px] text-neutral-400 block font-mono-code">
                        /{art.slug}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 font-semibold text-[10px] text-neutral-700">
                        {art.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-neutral-700 font-medium">
                      {art.author.name}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          art.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : art.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono-code text-neutral-600">
                      {art.views.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-neutral-500 font-mono-code text-[11px]">
                      {art.publishedAt}
                    </td>

                    {/* Actions: Edit, Duplicate, Preview, Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => goToAdmin('article-editor', art.id)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                          title="Edit Artikel"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateArticle(art.id)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                          title="Duplikasi Draf"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => goToArticle(art.slug)}
                          className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 rounded"
                          title="Pratinjau Publik"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteArticle(art.id, activeTab === 'trash')}
                          className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded"
                          title={activeTab === 'trash' ? 'Hapus Permanen' : 'Hapus ke Sampah'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-neutral-400">
                    Tidak ada naskah yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
