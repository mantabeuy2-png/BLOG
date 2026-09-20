import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('adrian@newsroom.id');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const { loginAsAdmin, showToast } = useCms();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      loginAsAdmin();
      onClose();
    } else {
      showToast(`Pendaftaran berhasil untuk ${name || 'Pembaca'}. Silakan masuk.`, 'success');
      setMode('login');
    }
  };

  const handleQuickAdminLogin = () => {
    loginAsAdmin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-neutral-200 overflow-hidden relative">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[11px] font-mono-code font-semibold tracking-wider uppercase text-red-600">AgenX Blog</span>
              <h2 className="text-xl font-bold font-serif-editorial text-neutral-900 mt-1">
                {mode === 'login' ? 'Masuk ke Portal Redaksi' : 'Daftar Akun'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Demo Login Banner */}
          <div className="mt-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <div className="text-xs text-neutral-600">
              <span className="font-semibold text-neutral-800">Akses Cepat:</span> Masuk langsung sebagai Pemimpin Redaksi (Admin).
            </div>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Masuk Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@domain.id"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-semibold tracking-wide transition-all shadow-sm"
            >
              {mode === 'login' ? 'Masuk' : 'Buat Akun'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-500 font-medium">
              Untuk Pengguna Terbatas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
