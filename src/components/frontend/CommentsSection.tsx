import React, { useState } from 'react';
import { Comment } from '../../types';
import { useCms } from '../../context/CmsContext';
import { MessageSquare, Send, ShieldCheck, User } from 'lucide-react';

interface CommentsSectionProps {
  articleId: string;
  articleTitle: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, articleTitle }) => {
  const { comments, addComment, currentUser } = useCms();

  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorEmail, setAuthorEmail] = useState(currentUser?.email || '');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Filter approved comments for this article
  const approvedComments = comments.filter(
    (c) => c.articleId === articleId && c.status === 'approved'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim() || !authorEmail.trim()) return;

    addComment({
      articleId,
      articleTitle,
      authorName,
      authorEmail,
      authorAvatar: currentUser?.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      content
    });

    setContent('');
    setSubmitted(true);
  };

  return (
    <section id="comments-section" className="mt-14 pt-10 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl sm:text-2xl font-bold font-serif-editorial text-neutral-900 flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-neutral-600" />
          <span>Tanggapan Pembaca ({approvedComments.length})</span>
        </h3>
        <span className="text-xs text-neutral-500 font-sans-ui">
          Dimoderasi sesuai pedoman komunitas
        </span>
      </div>

      {/* Comment Form */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200/80 shadow-xs mb-10">
        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-800 mb-4">
          Tuliskan Pandangan atau Kritik
        </h4>

        {submitted ? (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Komentar Anda telah dikirimkan!</p>
              <p className="text-xs text-emerald-700 mt-1">
                Komentar akan ditinjau oleh editor Newsroom sebelum ditampilkan secara publik. Anda dapat melihat proses moderasi di panel CMS Admin.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Alamat Email (Tidak Dipublikasikan)
                </label>
                <input
                  type="email"
                  required
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="email@domain.id"
                  className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Komentar Anda
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bagikan perspektif intelektual Anda mengenai naskah ini..."
                className="w-full p-3.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 leading-relaxed font-sans-ui"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-400">
                Patuhi etika berpendapat yang beradab dan berbasis argumen.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Tanggapan</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Approved Comments List */}
      <div className="space-y-6">
        {approvedComments.length === 0 ? (
          <div className="py-10 text-center text-neutral-400 text-sm font-sans-ui">
            Belum ada komentar untuk artikel ini. Jadilah yang pertama memberikan perspektif Anda.
          </div>
        ) : (
          approvedComments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 rounded-xl bg-white border border-neutral-200/80 shadow-xs flex items-start gap-4"
            >
              {comment.authorAvatar ? (
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-neutral-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1.5">
                  <h5 className="text-sm font-bold text-neutral-900">{comment.authorName}</h5>
                  <span className="text-[11px] text-neutral-400 font-mono-code">{comment.createdAt}</span>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed font-sans-ui">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
