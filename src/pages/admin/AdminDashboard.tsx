import React from 'react';
import { useCms } from '../../context/CmsContext';
import {
  FileText,
  Eye,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Trash2,
  FileEdit,
  UserCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    articles,
    comments,
    authors,
    users,
    goToAdmin,
    goToArticle,
    updateCommentStatus,
    deleteComment
  } = useCms();

  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftsCount = articles.filter((a) => a.status === 'draft').length;
  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const totalComments = comments.length;
  const pendingComments = comments.filter((c) => c.status === 'pending');

  const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  const recentArticles = [...articles].slice(0, 5);

  // Mock 7-day traffic chart data
  const trafficData = [
    { day: 'Sen', views: 8200 },
    { day: 'Sel', views: 11400 },
    { day: 'Rab', views: 9800 },
    { day: 'Kam', views: 14200 },
    { day: 'Jum', views: 18500 },
    { day: 'Sab', views: 16200 },
    { day: 'Min', views: 13900 }
  ];

  const maxTraffic = Math.max(...trafficData.map((d) => d.views));

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase">Total Artikel</span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{totalArticles}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">Aktif di database</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase">Terbit</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{publishedCount}</div>
          <span className="text-[11px] text-neutral-400 font-medium mt-1 inline-block">Live di publik</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase">Draf</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{draftsCount}</div>
          <span className="text-[11px] text-neutral-400 font-medium mt-1 inline-block">Menunggu rilis</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase">Total Tayangan</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{totalViews.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">+14.2% minggu ini</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase">Komentar</span>
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{totalComments}</div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 inline-block">
            {pendingComments.length} butuh moderasi
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase">Penulis</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{authors.length}</div>
          <span className="text-[11px] text-neutral-400 font-medium mt-1 inline-block">Dewan redaksi</span>
        </div>

        <div
          onClick={() => goToAdmin('users')}
          className="p-4 bg-white hover:bg-neutral-50/80 rounded-xl border border-neutral-200 shadow-2xs cursor-pointer transition-all hover:border-neutral-300"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase">Pengguna</span>
            <UserCheck className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{users.length}</div>
          <span className="text-[11px] text-red-600 font-medium mt-1 inline-block">Kelola akun &rarr;</span>
        </div>
      </div>

      {/* 2. Traffic Analytics & Top Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Traffic Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Performa Tayangan Pembaca</h3>
              <p className="text-xs text-neutral-500">Agregasi lalu lintas pembaca 7 hari terakhir</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +24% vs pekan lalu
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {trafficData.map((d, i) => {
              const heightPercent = Math.round((d.views / maxTraffic) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono-code text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.views.toLocaleString()}
                  </div>
                  <div className="w-full bg-neutral-100 rounded-t-sm relative h-36 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-neutral-900 group-hover:bg-red-600 rounded-t-sm transition-all"
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Top Articles */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900">Naskah Paling Banyak Dibaca</h3>
            <button
              onClick={() => goToAdmin('articles')}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {topArticles.map((art, idx) => (
              <div
                key={art.id}
                onClick={() => goToAdmin('article-editor', art.id)}
                className="py-3 flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-neutral-400 font-mono-code">#{idx + 1}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-900 truncate group-hover:text-red-600 transition-colors">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400">{art.category} • {art.author.name}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-neutral-800 font-mono-code">
                    {art.views.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">tayangan</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Articles & Moderation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Articles Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900">Aktivitas Naskah Terakhir</h3>
            <button
              onClick={() => goToAdmin('articles')}
              className="text-xs text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Kelola Semua ({articles.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5">Judul</th>
                  <th className="py-2.5">Kategori</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-neutral-50/80">
                    <td className="py-3 font-medium text-neutral-900 truncate max-w-[200px]">
                      {art.title}
                    </td>
                    <td className="py-3 text-neutral-500">{art.category}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          art.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : art.status === 'draft'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => goToAdmin('article-editor', art.id)}
                        className="p-1 text-neutral-500 hover:text-neutral-900"
                        title="Edit Naskah"
                      >
                        <FileEdit className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Comments Moderation */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900">Moderasi Komentar</h3>
            <button
              onClick={() => goToAdmin('comments')}
              className="text-xs text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Lihat Semua ({comments.length})
            </button>
          </div>

          <div className="space-y-3">
            {comments.slice(0, 4).map((com) => (
              <div key={com.id} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/60 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-neutral-900">{com.authorName}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                      com.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : com.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {com.status}
                  </span>
                </div>
                <p className="text-neutral-600 line-clamp-2 leading-relaxed mb-2 font-sans-ui">
                  "{com.content}"
                </p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-200/60">
                  <span className="text-neutral-400">{com.createdAt}</span>
                  <div className="flex gap-2">
                    {com.status !== 'approved' && (
                      <button
                        onClick={() => updateCommentStatus(com.id, 'approved')}
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        Setujui
                      </button>
                    )}
                    {com.status !== 'spam' && (
                      <button
                        onClick={() => updateCommentStatus(com.id, 'spam')}
                        className="text-amber-700 font-semibold hover:underline"
                      >
                        Spam
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(com.id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
