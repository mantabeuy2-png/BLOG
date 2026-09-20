import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Comment } from '../../types';
import {
  MessageSquare,
  CheckCircle,
  AlertOctagon,
  Trash2,
  CornerDownRight,
  User,
  Search
} from 'lucide-react';

export const AdminComments: React.FC = () => {
  const { comments, updateCommentStatus, deleteComment, showToast } = useCms();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'spam' | 'trash'>('all');
  const [search, setSearch] = useState('');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = comments.filter((c) => {
    if (activeTab !== 'all' && c.status !== activeTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.authorName.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        (c.articleTitle?.toLowerCase() || '').includes(q)
      );
    }
    return true;
  });

  const handleSendReply = (commentId: string) => {
    if (!replyText.trim()) return;
    showToast('Balasan redaksi berhasil diterbitkan', 'success');
    setReplyText('');
    setReplyingId(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      <div>
        <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
          Moderasi Diskusi & Komentar
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Tinjau respon pembaca, cegah spam bot, dan kelola kualitas dialog publik.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 pt-3 overflow-x-auto">
          <div className="flex gap-6 text-xs font-semibold">
            {(['all', 'pending', 'approved', 'spam', 'trash'] as const).map((tab) => {
              const count =
                tab === 'all' ? comments.length : comments.filter((c) => c.status === tab).length;
              const labels = {
                all: 'Semua',
                pending: 'Menunggu',
                approved: 'Disetujui',
                spam: 'Spam',
                trash: 'Sampah'
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
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

        {/* Search */}
        <div className="p-4 bg-neutral-50/70 border-b border-neutral-200">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama komentator, isi tanggapan, naskah..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        {/* Comments list */}
        <div className="divide-y divide-neutral-200">
          {filtered.map((comment) => (
            <div key={comment.id} className="p-6 hover:bg-neutral-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {comment.authorAvatar ? (
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-neutral-900 text-xs">{comment.authorName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono-code">
                        {comment.authorEmail}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Pada artikel:{' '}
                      <span className="font-semibold text-neutral-800">
                        {comment.articleTitle}
                      </span>
                    </p>

                    <p className="text-xs text-neutral-700 leading-relaxed mt-2.5 font-sans-ui bg-neutral-50 p-3 rounded-lg border border-neutral-200/60 max-w-3xl">
                      "{comment.content}"
                    </p>

                    {/* Reply box if active */}
                    {replyingId === comment.id && (
                      <div className="mt-3 flex gap-2 max-w-xl">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Tulis balasan resmi dewan redaksi..."
                          className="flex-1 px-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none"
                        />
                        <button
                          onClick={() => handleSendReply(comment.id)}
                          className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
                        >
                          Balas
                        </button>
                        <button
                          onClick={() => setReplyingId(null)}
                          className="px-2.5 py-1.5 border border-neutral-200 text-neutral-600 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      comment.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : comment.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {comment.status}
                  </span>

                  <div className="flex items-center gap-1.5 mt-1">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => updateCommentStatus(comment.id, 'approved')}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                        title="Setujui"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setReplyingId(replyingId === comment.id ? null : comment.id)}
                      className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded"
                      title="Balas"
                    >
                      <CornerDownRight className="w-4 h-4" />
                    </button>
                    {comment.status !== 'spam' && (
                      <button
                        onClick={() => updateCommentStatus(comment.id, 'spam')}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                        title="Tandai Spam"
                      >
                        <AlertOctagon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-neutral-400 text-xs">
              Tidak ada komentar dalam status ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
