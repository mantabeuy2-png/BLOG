import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Category } from '../../types';
import { FolderTree, Plus, Edit2, Trash2, Check, X, FileText } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, articles, saveCategory, deleteCategory, showToast } = useCms();

  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddModal = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      color: '#D9381E',
      seoTitle: '',
      seoDescription: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    const slug =
      editingCategory.slug ||
      editingCategory.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    saveCategory({
      ...editingCategory,
      slug,
      seoTitle: editingCategory.seoTitle || editingCategory.name,
      seoDescription: editingCategory.seoDescription || editingCategory.description
    });

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
            Kategori & Kanal Redaksi
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola pengelompokan rubrik jurnalisme, taksonomi naskah, dan parameter meta SEO kategori.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kanal Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-100/60 text-neutral-500 uppercase tracking-wider font-semibold">
              <th className="py-3 px-6">Nama Kanal</th>
              <th className="py-3 px-4">Slug URL</th>
              <th className="py-3 px-4">Deskripsi</th>
              <th className="py-3 px-4 text-center">Jumlah Artikel</th>
              <th className="py-3 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {categories.map((cat) => {
              const count = articles.filter(
                (a) => a.categoryId === cat.id || a.category.toLowerCase() === cat.name.toLowerCase()
              ).length;

              return (
                <tr key={cat.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-neutral-900">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: cat.color || '#171717' }}
                      />
                      <span>{cat.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono-code text-neutral-500">/{cat.slug}</td>

                  <td className="py-3.5 px-4 text-neutral-600 max-w-sm truncate">
                    {cat.description || '-'}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-neutral-800 font-mono-code">
                    {count}
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                        title="Sunting Kategori"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold font-serif-editorial text-neutral-900">
                {editingCategory.id ? 'Sunting Kanal Redaksi' : 'Buat Kanal Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Nama Kanal</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                      slug:
                        editingCategory.slug ||
                        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  placeholder="Contoh: Diplomasi & Geopolitik"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  placeholder="diplomasi-geopolitik"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none font-mono-code text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Deskripsi Kanal</label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  placeholder="Fokus liputan kanal editorial..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Meta Description SEO</label>
                <textarea
                  rows={2}
                  value={editingCategory.seoDescription}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, seoDescription: e.target.value })
                  }
                  placeholder="Deskripsi untuk hasil penelusuran mesin pencari..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none"
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
                  Simpan Kanal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
