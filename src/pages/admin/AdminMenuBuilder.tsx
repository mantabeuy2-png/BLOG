import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { MenuItem } from '../../types';
import { Menu, Plus, ArrowUp, ArrowDown, Edit2, Trash2, Link, ExternalLink, X } from 'lucide-react';

export const AdminMenuBuilder: React.FC = () => {
  const { menuItems, saveMenuItem, deleteMenuItem, reorderMenuItems, categories, staticPages, showToast } =
    useCms();

  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddModal = () => {
    setEditingItem({
      title: '',
      url: '',
      type: 'category',
      order: menuItems.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.url) return;

    saveMenuItem(editingItem);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...menuItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    reorderMenuItems(newItems);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
            Penataan Menu Navigasi Situs
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Atur struktur navbar utama, tautan cepat, dan prioritas urutan tampil.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item Menu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Reorderable Menu Items List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs font-semibold text-neutral-600">
            <span>Struktur Menu Utama Header</span>
            <span className="font-mono-code">{menuItems.length} menu aktif</span>
          </div>

          <div className="divide-y divide-neutral-200">
            {menuItems.map((item, index) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-mono-code font-bold text-xs text-neutral-600">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{item.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono-code">
                      {item.url} ({item.type})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                    title="Geser ke Atas"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === menuItems.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                    title="Geser ke Bawah"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-100"
                    title="Sunting"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-1.5 rounded border border-neutral-200 text-neutral-500 hover:text-red-600 hover:bg-neutral-100"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Preview of Navbar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 pb-2 border-b border-neutral-100">
            Pratinjau Navigasi Live
          </h3>
          <p className="text-xs text-neutral-500">
            Berikut adalah tampilan navigasi yang dilihat oleh pembaca di header website:
          </p>

          <div className="p-3 bg-neutral-900 text-white rounded-lg flex flex-wrap gap-2 text-xs">
            {menuItems.map((m) => (
              <span key={m.id} className="px-2.5 py-1 bg-white/10 rounded font-medium">
                {m.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Menu Item */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold font-serif-editorial text-neutral-900">
                {editingItem.id ? 'Sunting Item Menu' : 'Tambah Item Menu Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tipe Tautan</label>
                <select
                  value={editingItem.type}
                  onChange={(e) => {
                    const t = e.target.value as MenuItem['type'];
                    setEditingItem({ ...editingItem, type: t });
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                >
                  <option value="category">Kategori Rubrik</option>
                  <option value="page">Halaman Statis</option>
                  <option value="custom">URL Kustom Eksternal</option>
                </select>
              </div>

              {editingItem.type === 'category' && (
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Pilih Kanal</label>
                  <select
                    onChange={(e) => {
                      const selected = categories.find((c) => c.slug === e.target.value);
                      if (selected) {
                        setEditingItem({
                          ...editingItem,
                          title: selected.name,
                          url: `/category/${selected.slug}`
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                  >
                    <option value="">-- Pilih dari Kategori Tersedia --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingItem.type === 'page' && (
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Pilih Halaman</label>
                  <select
                    onChange={(e) => {
                      const selected = staticPages.find((p) => p.slug === e.target.value);
                      if (selected) {
                        setEditingItem({
                          ...editingItem,
                          title: selected.title,
                          url: `/page/${selected.slug}`
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                  >
                    <option value="">-- Pilih dari Halaman Statis --</option>
                    {staticPages.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Label Tampilan</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Opini & Kolom"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">URL Target</label>
                <input
                  type="text"
                  required
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  placeholder="/category/opini atau https://..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none font-mono-code text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
