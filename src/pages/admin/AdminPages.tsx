import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { StaticPage as StaticPageType } from '../../types';
import { FileCode, Edit2, Plus, Trash2, Eye, X } from 'lucide-react';

export const AdminPages: React.FC = () => {
  const { staticPages, saveStaticPage, deleteStaticPage, goToPage } = useCms();

  const [editingPage, setEditingPage] = useState<Partial<StaticPageType> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddModal = () => {
    setEditingPage({
      title: '',
      slug: '',
      content: '<p>Tuliskan isi naskah kebijakan atau informasi halaman di sini...</p>',
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (page: StaticPageType) => {
    setEditingPage({ ...page });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage?.title) return;

    const slug =
      editingPage.slug ||
      editingPage.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    saveStaticPage({
      ...editingPage,
      slug,
      updatedAt: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
    setEditingPage(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
            Halaman Kebijakan & Statis
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola halaman tetap seperti Tentang Redaksi, Pedoman Etika Jurnalisme, dan Kontak.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Halaman</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-100/60 text-neutral-500 uppercase tracking-wider font-semibold">
              <th className="py-3 px-6">Judul Halaman</th>
              <th className="py-3 px-4">Slug URL</th>
              <th className="py-3 px-4">Pembaruan Terakhir</th>
              <th className="py-3 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {staticPages.map((page) => (
              <tr key={page.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3.5 px-6 font-semibold text-neutral-900">
                  {page.title}
                </td>
                <td className="py-3.5 px-4 font-mono-code text-neutral-500">
                  /page/{page.slug}
                </td>
                <td className="py-3.5 px-4 font-mono-code text-neutral-500">
                  {page.updatedAt}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => goToPage(page.slug)}
                      className="p-1.5 text-neutral-500 hover:text-blue-600 rounded hover:bg-neutral-100"
                      title="Lihat Halaman Publik"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEditModal(page)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                      title="Sunting"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteStaticPage(page.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-600 rounded hover:bg-neutral-100"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Page Modal */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold font-serif-editorial text-neutral-900">
                {editingPage.id ? 'Sunting Halaman' : 'Tambah Halaman Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Judul Halaman</label>
                <input
                  type="text"
                  required
                  value={editingPage.title}
                  onChange={(e) =>
                    setEditingPage({
                      ...editingPage,
                      title: e.target.value,
                      slug:
                        editingPage.slug ||
                        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none font-mono-code text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Konten Halaman (Mendukung HTML & Tipografi Editorial)
                </label>
                <textarea
                  rows={10}
                  required
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="w-full p-3 font-mono-code text-xs leading-relaxed border border-neutral-300 rounded-lg focus:outline-none"
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
                  Simpan Halaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
