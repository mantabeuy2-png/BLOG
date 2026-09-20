import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Tag, Article } from '../../types';
import { Tags, Plus, Trash2, Edit2, X } from 'lucide-react';

export const AdminTags: React.FC = () => {
  const { tags, articles, saveTag, deleteTag } = useCms();
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    saveTag({
      name: newTagName.trim(),
      slug: newTagName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });

    setNewTagName('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    saveTag(editingTag);
    setEditingTag(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      <div>
        <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
          Topik & Indeks Tagar
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Kelola kata kunci taksonomi untuk menghubungkan artikel silang kanal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Add New Tag Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 pb-2 border-b border-neutral-100">
            {editingTag ? 'Sunting Topik' : 'Tambah Topik Baru'}
          </h3>

          <form onSubmit={editingTag ? handleUpdate : handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Nama Topik</label>
              <input
                type="text"
                required
                value={editingTag ? editingTag.name : newTagName}
                onChange={(e) =>
                  editingTag
                    ? setEditingTag({
                        ...editingTag,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      })
                    : setNewTagName(e.target.value)
                }
                placeholder="Contoh: Energi Terbarukan"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>

            {editingTag && (
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Slug Topik</label>
                <input
                  type="text"
                  required
                  value={editingTag.slug}
                  onChange={(e) => setEditingTag({ ...editingTag, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none font-mono-code text-[11px]"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {editingTag && (
                <button
                  type="button"
                  onClick={() => setEditingTag(null)}
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors"
              >
                {editingTag ? 'Simpan Perubahan' : 'Tambah Topik'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Tags Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100/60 text-neutral-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Topik / Tag</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4 text-center">Naskah Terhubung</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {tags.map((tag) => {
                const count = articles.filter((a) =>
                  a.tags?.some((t) => t.toLowerCase() === tag.name.toLowerCase() || t.toLowerCase() === tag.slug.toLowerCase())
                ).length;

                return (
                  <tr key={tag.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-6 font-semibold text-neutral-900">
                      #{tag.name}
                    </td>
                    <td className="py-3 px-4 font-mono-code text-neutral-500">
                      {tag.slug}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-neutral-800 font-mono-code">
                      {count}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTag(tag)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                          title="Sunting"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTag(tag.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded"
                          title="Hapus"
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
      </div>
    </div>
  );
};
