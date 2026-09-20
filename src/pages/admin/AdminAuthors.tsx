import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Author } from '../../types';
import { Users, Plus, Edit2, Trash2, Mail, ExternalLink, X } from 'lucide-react';

export const AdminAuthors: React.FC = () => {
  const { authors, articles, saveAuthor, deleteAuthor } = useCms();

  const [editingAuthor, setEditingAuthor] = useState<Partial<Author> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddModal = () => {
    setEditingAuthor({
      name: '',
      slug: '',
      role: 'Jurnalis Investigasi',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      email: '',
      twitter: '',
      linkedin: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (author: Author) => {
    setEditingAuthor({ ...author });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor?.name) return;

    const slug =
      editingAuthor.slug ||
      editingAuthor.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    saveAuthor({
      ...editingAuthor,
      slug
    });

    setIsModalOpen(false);
    setEditingAuthor(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
            Penulis, Redaktur & Kontributor
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manajemen profil jurnalistik, biografi kepenulisan, dan atribusi karya editorial.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Penulis Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => {
          const count = articles.filter(
            (a) => a.author.id === author.id || a.author.slug === author.slug
          ).length;

          return (
            <div
              key={author.id}
              className="bg-white rounded-xl border border-neutral-200 p-6 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-100"
                    />
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm">{author.name}</h3>
                      <span className="text-[11px] text-red-600 font-semibold uppercase tracking-wider block">
                        {author.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(author)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded hover:bg-neutral-100"
                      title="Sunting"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAuthor(author.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-neutral-100"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                  {author.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span className="font-mono-code font-bold text-neutral-900">
                  {count} naskah terbit
                </span>
                <span className="text-[11px] truncate max-w-[150px]">{author.email}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Author Edit/Add Modal */}
      {isModalOpen && editingAuthor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold font-serif-editorial text-neutral-900">
                {editingAuthor.id ? 'Sunting Penulis' : 'Tambah Profil Penulis'}
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
                <label className="block font-semibold text-neutral-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingAuthor.name}
                  onChange={(e) =>
                    setEditingAuthor({
                      ...editingAuthor,
                      name: e.target.value,
                      slug:
                        editingAuthor.slug ||
                        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Jabatan Redaksi</label>
                <input
                  type="text"
                  required
                  value={editingAuthor.role}
                  onChange={(e) =>
                    setEditingAuthor({ ...editingAuthor, role: e.target.value })
                  }
                  placeholder="Editor Senior / Penulis Khusus"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Biografi Singkat</label>
                <textarea
                  rows={3}
                  value={editingAuthor.bio}
                  onChange={(e) =>
                    setEditingAuthor({ ...editingAuthor, bio: e.target.value })
                  }
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">URL Avatar / Foto</label>
                <input
                  type="url"
                  value={editingAuthor.avatar}
                  onChange={(e) =>
                    setEditingAuthor({ ...editingAuthor, avatar: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none font-mono-code text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={editingAuthor.email}
                  onChange={(e) =>
                    setEditingAuthor({ ...editingAuthor, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
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
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
