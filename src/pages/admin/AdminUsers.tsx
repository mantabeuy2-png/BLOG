import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { User } from '../../types';
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Search,
  Check,
  X,
  Key,
  Shield,
  ShieldAlert,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Copy,
  ExternalLink,
  SlidersHorizontal,
  User as UserIcon
} from 'lucide-react';
import { MediaPickerModal } from '../../components/shared/MediaPickerModal';

// Preset avatar photos for quick selection
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
];

export const AdminUsers: React.FC = () => {
  const { users, currentUser, saveUser, deleteUser, toggleUserStatus, showToast } = useCms();

  // Filters & Search
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Quick Password Reset Modal
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);
  const [newQuickPassword, setNewQuickPassword] = useState('');
  const [showQuickPassword, setShowQuickPassword] = useState(false);

  // Visible passwords tracking in table
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  const togglePasswordReveal = (userId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Generate strong password
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Open Create Modal
  const openAddModal = () => {
    setEditingUser({
      name: '',
      username: '',
      email: '',
      avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)],
      password: generateStrongPassword(),
      role: 'author',
      status: 'active'
    });
    setShowPassword(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: User) => {
    setEditingUser({ ...user });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  // Save User
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editingUser.username || !editingUser.username.trim()) {
      showToast('Username wajib diisi', 'error');
      return;
    }

    if (!editingUser.email || !editingUser.email.includes('@')) {
      showToast('Email valid wajib diisi', 'error');
      return;
    }

    if (!editingUser.id && (!editingUser.password || editingUser.password.length < 6)) {
      showToast('Password minimal 6 karakter', 'error');
      return;
    }

    // Check username uniqueness
    const cleanUsername = editingUser.username
      .toLowerCase()
      .replace(/[^a-z0-9_.]+/g, '')
      .trim();

    const isDuplicate = users.some(
      (u) => u.username.toLowerCase() === cleanUsername && u.id !== editingUser.id
    );

    if (isDuplicate) {
      showToast(`Username "@${cleanUsername}" sudah digunakan akun lain`, 'error');
      return;
    }

    saveUser({
      ...editingUser,
      username: cleanUsername,
      name: editingUser.name?.trim() || cleanUsername,
      avatar: editingUser.avatar?.trim() || PRESET_AVATARS[0]
    });

    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Handle Quick Password Reset
  const handleSaveQuickPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || !newQuickPassword.trim()) return;

    if (newQuickPassword.length < 6) {
      showToast('Password baru minimal 6 karakter', 'error');
      return;
    }

    saveUser({
      id: passwordModalUser.id,
      password: newQuickPassword
    });

    showToast(`Password untuk @${passwordModalUser.username} berhasil diubah`, 'success');
    setPasswordModalUser(null);
    setNewQuickPassword('');
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  // Role Badges config
  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 border border-red-200">
            <Shield className="w-3 h-3 text-red-600" />
            Administrator
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
            <ShieldAlert className="w-3 h-3 text-indigo-600" />
            Redaktur (Editor)
          </span>
        );
      case 'author':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <UserIcon className="w-3 h-3 text-emerald-600" />
            Penulis (Author)
          </span>
        );
      case 'subscriber':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
            <UserCheck className="w-3 h-3 text-neutral-500" />
            Pelanggan (Subscriber)
          </span>
        );
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} berhasil disalin ke clipboard`, 'info');
  };

  // Calculate metrics
  const totalCount = users.length;
  const adminEditorCount = users.filter((u) => u.role === 'admin' || u.role === 'editor').length;
  const authorCount = users.filter((u) => u.role === 'author').length;
  const activeCount = users.filter((u) => (u.status || 'active') === 'active').length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans-ui">
      {/* 1. Top Section & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
              Daftar Pengguna
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800 text-xs font-bold font-mono-code">
              {totalCount} Akun
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola data akun pengguna: nama pengguna (username), alamat email, foto profil, dan kata sandi akses sistem.
          </p>
        </div>

        <button
          id="btn-tambah-pengguna"
          onClick={openAddModal}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-semibold uppercase">Total Pengguna</span>
            <UserCheck className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{totalCount}</div>
          <span className="text-[11px] text-neutral-500">Terdaftar di sistem</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-semibold uppercase">Admin & Redaktur</span>
            <Shield className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{adminEditorCount}</div>
          <span className="text-[11px] text-red-600 font-medium">Akses panel manajerial</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-semibold uppercase">Penulis & Jurnalis</span>
            <UserIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{authorCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Kontributor naskah</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-semibold uppercase">Status Aktif</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{activeCount}</div>
          <span className="text-[11px] text-neutral-400">{totalCount - activeCount} nonaktif</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="input-cari-pengguna"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan username (@...), nama, atau email..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
          {/* Role Filter */}
          <select
            id="filter-peran"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">Semua Peran</option>
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="author">Penulis (Author)</option>
            <option value="subscriber">Subscriber</option>
          </select>

          {/* Status Filter */}
          <select
            id="filter-status-pengguna"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-xs font-semibold ${
                viewMode === 'table' ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
              }`}
              title="Tampilan Tabel"
            >
              Tabel
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-xs font-semibold ${
                viewMode === 'cards' ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
              }`}
              title="Tampilan Kartu"
            >
              Kartu
            </button>
          </div>
        </div>
      </div>

      {/* 4. Users View: Table or Cards */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center shadow-2xs">
          <UserCheck className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">Tidak ada data pengguna yang cocok</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau bersihkan filter peran dan status.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
            className="mt-4 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md text-xs font-medium"
          >
            Reset Filter
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Pengguna & Foto Profil</th>
                  <th className="py-3.5 px-4">Username</th>
                  <th className="py-3.5 px-4">Alamat Email</th>
                  <th className="py-3.5 px-4">Kata Sandi (Password)</th>
                  <th className="py-3.5 px-4">Peran (Role)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;
                  const isRevealed = !!revealedPasswords[user.id];
                  const passwordValue = user.password || '••••••••';

                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                      {/* Photo Profile & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={user.avatar}
                              alt={user.name || user.username}
                              className="w-10 h-10 rounded-full object-cover border border-neutral-200 shadow-2xs"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                              }}
                            />
                            {user.status === 'inactive' ? (
                              <span
                                className="w-2.5 h-2.5 rounded-full bg-neutral-300 border-2 border-white absolute bottom-0 right-0"
                                title="Nonaktif"
                              />
                            ) : (
                              <span
                                className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0"
                                title="Aktif"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                              <span>{user.name || user.username}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-md text-[9px] font-bold uppercase tracking-wider">
                                  Anda
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-neutral-400 block font-mono-code">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono-code font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                            @{user.username}
                          </span>
                          <button
                            onClick={() => copyToClipboard(`@${user.username}`, 'Username')}
                            title="Salin Username"
                            className="text-neutral-400 hover:text-neutral-600 p-1 rounded"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-neutral-700">
                          <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <a
                            href={`mailto:${user.email}`}
                            className="hover:underline hover:text-neutral-900 truncate max-w-[180px]"
                          >
                            {user.email}
                          </a>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="font-mono-code text-xs bg-neutral-50 px-2 py-1 rounded border border-neutral-200 text-neutral-700 min-w-[110px]">
                            {isRevealed ? (
                              <span className="font-semibold text-neutral-900">{passwordValue}</span>
                            ) : (
                              <span className="tracking-widest text-neutral-500">••••••••••</span>
                            )}
                          </div>
                          <button
                            onClick={() => togglePasswordReveal(user.id)}
                            title={isRevealed ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                            className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          {isRevealed && user.password && (
                            <button
                              onClick={() => copyToClipboard(user.password || '', 'Password')}
                              title="Salin Kata Sandi"
                              className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            (user.status || 'active') === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200'
                          }`}
                          title="Klik untuk mengubah status"
                        >
                          {(user.status || 'active') === 'active' ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setPasswordModalUser(user);
                              setNewQuickPassword(generateStrongPassword());
                              setShowQuickPassword(true);
                            }}
                            title="Ubah Password Cepat"
                            className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            title="Sunting Lengkap"
                            className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => {
                                if (confirm(`Hapus akun pengguna @${user.username}?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              title="Hapus Akun"
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => {
            const isCurrent = currentUser?.id === user.id;
            const isRevealed = !!revealedPasswords[user.id];
            const passwordValue = user.password || '••••••••';

            return (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs flex flex-col justify-between hover:border-neutral-300 transition-all"
              >
                <div>
                  {/* Top card bar: Role badge and Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {getRoleBadge(user.role)}
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                        (user.status || 'active') === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                      }`}
                    >
                      {(user.status || 'active') === 'active' ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </div>

                  {/* Profile Info */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name || user.username}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white ring-2 ring-neutral-100 shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-neutral-900 text-sm truncate flex items-center gap-1.5">
                        <span>{user.name || user.username}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 bg-red-600 text-white rounded text-[9px] font-bold uppercase">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono-code font-semibold text-red-600 mt-0.5 flex items-center gap-1">
                        <span>@{user.username}</span>
                        <button
                          onClick={() => copyToClipboard(`@${user.username}`, 'Username')}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[11px] text-neutral-400 block truncate mt-0.5">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Password block */}
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80 mb-4">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <Lock className="w-3 h-3 text-neutral-400" /> Kata Sandi:
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePasswordReveal(user.id)}
                          className="text-neutral-500 hover:text-neutral-900 p-0.5"
                          title="Tampilkan"
                        >
                          {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        {isRevealed && user.password && (
                          <button
                            onClick={() => copyToClipboard(user.password || '', 'Password')}
                            className="text-neutral-500 hover:text-neutral-900 p-0.5"
                            title="Salin"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="font-mono-code text-xs text-neutral-800 font-medium">
                      {isRevealed ? passwordValue : '••••••••••••'}
                    </div>
                  </div>
                </div>

                {/* Card footer action buttons */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-mono-code">
                    {user.createdAt ? `Daftar: ${user.createdAt}` : 'Akun Terdaftar'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setPasswordModalUser(user);
                        setNewQuickPassword(generateStrongPassword());
                        setShowQuickPassword(true);
                      }}
                      className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md flex items-center gap-1"
                    >
                      <Key className="w-3 h-3" />
                      <span>Sandi</span>
                    </button>
                    <button
                      onClick={() => openEditModal(user)}
                      className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Sunting</span>
                    </button>
                    {!isCurrent && (
                      <button
                        onClick={() => {
                          if (confirm(`Hapus pengguna @${user.username}?`)) {
                            deleteUser(user.id);
                          }
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Modal Tambah / Sunting Pengguna (Username, Email, Photo Profile, Password) */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/60">
              <div>
                <h3 className="font-serif-editorial font-bold text-lg text-neutral-900">
                  {editingUser.id ? 'Sunting Data Pengguna' : 'Tambah Pengguna Baru'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Isikan informasi username, email, foto profil, dan kata sandi akun pengguna.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 text-xs text-neutral-700">
              {/* Photo Profile Section */}
              <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-3">
                <label className="font-bold text-neutral-900 block text-xs">
                  Foto Profil (Photo Profile)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={editingUser.avatar || PRESET_AVATARS[0]}
                      alt="Avatar Pratinjau"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-neutral-200 shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_AVATARS[0];
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        id="input-photo-profile"
                        type="url"
                        value={editingUser.avatar || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                        placeholder="https://images.unsplash.com/... atau URL foto"
                        className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Pilih Media</span>
                      </button>
                    </div>

                    {/* Quick Avatar Presets */}
                    <div>
                      <span className="text-[10px] text-neutral-500 font-semibold block mb-1">
                        Atau pilih foto profil kilat:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {PRESET_AVATARS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditingUser({ ...editingUser, avatar: preset })}
                            className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                              editingUser.avatar === preset ? 'border-red-600 scale-110' : 'border-transparent'
                            }`}
                          >
                            <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Username & Full Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="font-bold text-neutral-900 block mb-1.5 text-xs">
                    Username / Nama Pengguna <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-code font-bold text-neutral-400 text-xs">
                      @
                    </span>
                    <input
                      id="input-username"
                      type="text"
                      required
                      value={editingUser.username || ''}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]+/g, '')
                        })
                      }
                      placeholder="contoh: budi_santoso"
                      className="w-full pl-7 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono-code focus:bg-white focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Huruf kecil, angka, garis bawah (_), atau titik (.).
                  </span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="font-bold text-neutral-900 block mb-1.5 text-xs">
                    Nama Lengkap Tampilan
                  </label>
                  <input
                    id="input-nama-lengkap"
                    type="text"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    placeholder="Nama Lengkap Pengguna"
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Nama yang ditampilkan pada kartu profil & karya naskah.
                  </span>
                </div>
              </div>

              {/* Email & Role Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="font-bold text-neutral-900 block mb-1.5 text-xs">
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="input-email"
                      type="email"
                      required
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      placeholder="pengguna@agenxblog.com"
                      className="w-full pl-8 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="font-bold text-neutral-900 block mb-1.5 text-xs">
                    Peran & Hak Akses (Role)
                  </label>
                  <select
                    id="select-role"
                    value={editingUser.role || 'subscriber'}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value as User['role'] })
                    }
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                  >
                    <option value="admin">Administrator (Pemimpin Redaksi / IT)</option>
                    <option value="editor">Editor (Redaktur Pelaksana)</option>
                    <option value="author">Penulis (Author / Jurnalis)</option>
                    <option value="subscriber">Subscriber (Pembaca Terdaftar)</option>
                  </select>
                </div>
              </div>

              {/* Password (Kata Sandi) */}
              <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-600" />
                    Kata Sandi (Password) {!editingUser.id && <span className="text-red-500">*</span>}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = generateStrongPassword();
                      setEditingUser({ ...editingUser, password: rand });
                      setShowPassword(true);
                    }}
                    className="text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-neutral-200 shadow-2xs hover:bg-neutral-50"
                  >
                    <Sparkles className="w-3 h-3 text-red-600" />
                    <span>Acak Sandi Kuat</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder={
                      editingUser.id ? 'Biarkan kosong bila tidak ingin mengganti sandi' : 'Minimal 6 karakter'
                    }
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono-code focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  {editingUser.id
                    ? 'Ketikkan password baru hanya jika Anda ingin memperbarui sandi pengguna ini.'
                    : 'Gunakan minimal 6 karakter kombinasi huruf, angka, dan simbol untuk keamanan maksimal.'}
                </span>
              </div>

              {/* Status Akun */}
              <div>
                <label className="font-bold text-neutral-900 block mb-1.5 text-xs">
                  Status Keaktifan Akun
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="account-status"
                      checked={(editingUser.status || 'active') === 'active'}
                      onChange={() => setEditingUser({ ...editingUser, status: 'active' })}
                      className="text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="font-medium text-emerald-700">Aktif (Dapat Masuk)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="account-status"
                      checked={editingUser.status === 'inactive'}
                      onChange={() => setEditingUser({ ...editingUser, status: 'inactive' })}
                      className="text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="font-medium text-neutral-500">Nonaktif (Akses Ditangguhkan)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  id="btn-simpan-pengguna"
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser.id ? 'Perbarui Pengguna' : 'Simpan Pengguna Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Quick Password Reset Modal */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-neutral-200 shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Ubah Kata Sandi</h3>
                <span className="text-xs text-neutral-500">
                  Untuk akun <strong className="text-neutral-900">@{passwordModalUser.username}</strong>
                </span>
              </div>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickPassword} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-neutral-800">Kata Sandi Baru</label>
                  <button
                    type="button"
                    onClick={() => setNewQuickPassword(generateStrongPassword())}
                    className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Acak Baru
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showQuickPassword ? 'text' : 'password'}
                    required
                    value={newQuickPassword}
                    onChange={(e) => setNewQuickPassword(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full pl-3 pr-10 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg font-mono-code text-xs focus:bg-white focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQuickPassword(!showQuickPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showQuickPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Kata Sandi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Media Picker for Photo Profile */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media) => {
          if (editingUser) {
            setEditingUser({ ...editingUser, avatar: media.url });
          }
          setIsMediaPickerOpen(false);
          showToast('Foto profil dari Pustaka Media berhasil dipilih', 'success');
        }}
        title="Pilih Foto Profil dari Pustaka Media"
      />
    </div>
  );
};
