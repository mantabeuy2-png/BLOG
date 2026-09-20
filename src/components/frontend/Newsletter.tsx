import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useCms();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast(`Terima kasih! Buletin kurasi mingguan akan dikirimkan ke ${email}`, 'success');
  };

  return (
    <section className="my-12 rounded-2xl bg-neutral-900 text-white p-8 sm:p-12 relative overflow-hidden">
      {/* Subtle typographic background watermark */}
      <div className="absolute right-4 -bottom-10 select-none pointer-events-none opacity-5 text-8xl sm:text-9xl font-serif-editorial font-bold">
        DISPATCH
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-4">
          <Mail className="w-3.5 h-3.5 text-red-400" />
          <span>Buletin Redaksi</span>
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-editorial tracking-tight leading-tight">
          Dapatkan Insight terbaru di dunia teknologi bisnis UMKM di Email anda.
        </h3>

        <p className="mt-3 text-sm sm:text-base text-neutral-300 font-sans-ui leading-relaxed">
          Setiap Sabtu pagi, kami mengirimkan satu esai investigasi terpilih, rangkuman disrupsi teknologi, dan pandangan kritis dari meja dewan redaksi. Bebas spam, hening, dan bermakna.
        </p>

        {subscribed ? (
          <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium text-white">
              Anda telah terdaftar di buletin Newsroom. Cek surel konfirmasi Anda.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat email Anda..."
              className="flex-1 px-4 py-3 text-sm text-white placeholder-neutral-400 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-white focus:bg-white/15 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-sm rounded-xl transition-colors shadow-sm shrink-0 tracking-wide"
            >
              Berlangganan
            </button>
          </form>
        )}

        <p className="mt-3 text-[11px] text-neutral-400">
          Dengan berlangganan, Anda menyetujui Kebijakan Privasi Newsroom. Berhenti berlangganan kapan saja dengan 1 klik.
        </p>
      </div>
    </section>
  );
};
