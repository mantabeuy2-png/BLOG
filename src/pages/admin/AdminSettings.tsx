import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { SiteSettings } from '../../types';
import {
  Save,
  Settings,
  Palette,
  Globe,
  Shield,
  Check,
  Sparkles,
  Cpu,
  Bot,
  Zap,
  CheckCircle2,
  Sliders,
  Info,
  Server,
  Code,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Link2
} from 'lucide-react';

interface AIModelDef {
  id: string;
  name: string;
  badge?: string;
  desc: string;
}

interface AIProviderDef {
  id: string;
  name: string;
  company: string;
  tag: string;
  desc: string;
  defaultModel: string;
  models: AIModelDef[];
}

const AI_PROVIDERS: AIProviderDef[] = [
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    company: 'Google AI Studio',
    tag: 'Rekomendasi Utama',
    desc: 'Model multimodal canggih dengan kecepatan tinggi, akurasi penalaran jurnalistik, dan efisiensi biaya token.',
    defaultModel: 'gemini-2.5-flash',
    models: [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', badge: 'Populer & Efisien', desc: 'Sangat cepat, cerdas, dan hemat kuota untuk produksi naskah artikel harian.' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', badge: 'Penalaran Mendalam', desc: 'Kemampuan analisis komprehensif, riset mendalam, dan tulisan bergaya editorial panjang.' },
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', badge: 'Generasi Mutakhir', desc: 'Generasi terbaru dengan pemahaman konteks tinggi dan latensi rendah.' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', badge: 'Respon Kilat', desc: 'Generasi kilat untuk draft cepat dan ringkasan berita terdepan.' },
      { id: 'custom', name: 'Tentukan Model Kustom...', badge: 'Manual', desc: 'Tuliskan identifier model Google Gemini kustom Anda sendiri.' },
    ],
  },
  {
    id: 'custom',
    name: 'Kustom Provider (Self-Hosted / OpenAI-Compatible)',
    company: 'Ollama / vLLM / LM Studio / Endpoint Privat',
    tag: 'API, Base URL & Model',
    desc: 'Gunakan server model Anda sendiri dengan memasukkan API Key, Base URL kustom, dan fitur deteksi model otomatis.',
    defaultModel: 'custom',
    models: [
      { id: 'custom', name: 'Model Kustom / Terdeteksi', badge: 'Kustom', desc: 'Model yang ditentukan via Base URL atau deteksi otomatis.' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    company: 'OpenAI Platform',
    tag: 'GPT-4o Engine',
    desc: 'Rangkaian model GPT unggulan untuk pembuatan artikel kreatif, pemformatan terstruktur, dan analisis editorial.',
    defaultModel: 'gpt-4o',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', badge: 'Flagship Omnimodel', desc: 'Model multimodal flagship dengan pemahaman kontekstual dan penulisan mendalam.' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', badge: 'Cepat & Ekonomis', desc: 'Model ringan dan sangat terjangkau untuk skala artikel massal.' },
      { id: 'o3-mini', name: 'o3-mini', badge: 'Penalaran Tinggi', desc: 'Penalaran khusus untuk topik teknis, analisis ilmiah, dan isu kompleks.' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', badge: 'Dokumen Panjang', desc: 'Model teruji untuk penulisan artikel berbobot tinggi.' },
      { id: 'custom', name: 'Tentukan Model Kustom...', badge: 'Manual', desc: 'Tuliskan identifier model OpenAI kustom Anda sendiri.' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    company: 'Anthropic AI',
    tag: 'Editorial Nuance',
    desc: 'Model Claude terkemuka dengan gaya prosa natural, nuansa jurnalistik kaya, dan kepatuhan faktual tinggi.',
    defaultModel: 'claude-3-5-sonnet',
    models: [
      { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', badge: 'Hybrid Thinking', desc: 'Model hybrid mutakhir dengan kemampuan penalaran fleksibel.' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', badge: 'Pilihan Editorial', desc: 'Gaya penulisan sangat elegan, kaya kosakata, dan menyerupai jurnalis profesional.' },
      { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', badge: 'Respon Cepat', desc: 'Respon kilat dan efisien untuk draf cepat.' },
      { id: 'custom', name: 'Tentukan Model Kustom...', badge: 'Manual', desc: 'Tuliskan identifier model Claude kustom Anda sendiri.' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    company: 'Groq LPU Engine',
    tag: 'Ultra-Fast Inference',
    desc: 'Akselerasi chip LPU dengan kecepatan inferensi ratusan kata per detik untuk alur kerja instan.',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', badge: 'Super Cepat', desc: 'Model open-weight 70B dengan kecepatan inferensi luar biasa.' },
      { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill 70B', badge: 'Reasoning', desc: 'Model penalaran intensif dengan kecepatan inferensi Groq.' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (32k)', badge: 'Konteks Luas', desc: 'Arsitektur MoE untuk penulisan dengan konteks dokumen panjang.' },
      { id: 'custom', name: 'Tentukan Model Kustom...', badge: 'Manual', desc: 'Tuliskan identifier model Groq kustom Anda sendiri.' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    company: 'Multi-Provider Hub',
    tag: 'Aggregator',
    desc: 'Gateway terpadu yang menghubungkan ratusan model AI dari berbagai penyedia terkemuka dunia.',
    defaultModel: 'google/gemini-2.5-flash',
    models: [
      { id: 'google/gemini-2.5-flash', name: 'Google: Gemini 2.5 Flash', badge: 'OpenRouter', desc: 'Routing ke model Gemini 2.5 Flash via OpenRouter.' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Anthropic: Claude 3.5 Sonnet', badge: 'OpenRouter', desc: 'Routing ke model Claude 3.5 Sonnet via OpenRouter.' },
      { id: 'openai/gpt-4o', name: 'OpenAI: GPT-4o', badge: 'OpenRouter', desc: 'Routing ke model GPT-4o via OpenRouter.' },
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek: R1 Full', badge: 'OpenRouter', desc: 'Model reasoning open terdepan via OpenRouter.' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Meta: Llama 3.3 70B', badge: 'OpenRouter', desc: 'Model instruksi terbuka Meta via OpenRouter.' },
      { id: 'custom', name: 'Tentukan Model Kustom...', badge: 'Manual', desc: 'Tuliskan path model kustom di OpenRouter.' },
    ],
  },
];

const BASE_URL_PRESETS = [
  { label: 'Agnes AI (agnes-ai.com)', url: 'https://agnes-ai.com/', defaultModel: 'gpt-4o' },
  { label: 'Bynara Router (router.bynara.id)', url: 'https://router.bynara.id/', defaultModel: 'claude-3-5-sonnet' },
  { label: 'Ollama Lokal (localhost:11434)', url: 'http://localhost:11434/v1', defaultModel: 'llama3:8b' },
  { label: 'OpenAI Platform', url: 'https://api.openai.com/v1', defaultModel: 'gpt-4o' },
  { label: 'OpenRouter.ai', url: 'https://openrouter.ai/api/v1', defaultModel: 'google/gemini-2.5-flash' },
  { label: 'Groq Cloud', url: 'https://api.groq.com/openai/v1', defaultModel: 'llama-3.3-70b-versatile' },
  { label: 'DeepSeek API', url: 'https://api.deepseek.com/v1', defaultModel: 'deepseek-chat' },
  { label: 'vLLM / LM Studio', url: 'http://localhost:8000/v1', defaultModel: 'local-model' },
];

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = useCms();
  const [formData, setFormData] = useState<SiteSettings>({
    ...settings,
    aiProvider: settings.aiProvider || 'google-gemini',
    aiModel: settings.aiModel || 'gemini-2.5-flash',
    aiDefaultTone: settings.aiDefaultTone || 'Jurnalistik Obyektif & Analitis',
    aiCustomBaseUrl: settings.aiCustomBaseUrl || 'http://localhost:11434/v1',
    aiCustomApiKey: settings.aiCustomApiKey || '',
    aiCustomModel: settings.aiCustomModel || 'llama3:8b',
    aiDetectedModels: settings.aiDetectedModels || ['llama3:8b', 'llama3:70b', 'mistral:latest', 'qwen2.5:7b', 'deepseek-r1:8b'],
  });

  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectStatus, setDetectStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
    count?: number;
    endpoint?: string;
  }>({
    type: formData.aiDetectedModels && formData.aiDetectedModels.length > 0 ? 'success' : 'idle',
    count: formData.aiDetectedModels?.length || 0,
    message: formData.aiDetectedModels?.length ? `${formData.aiDetectedModels.length} model tersimpan dari deteksi sebelumnya.` : undefined,
  });

  const currentProvider = AI_PROVIDERS.find((p) => p.id === (formData.aiProvider || 'google-gemini')) || AI_PROVIDERS[0];
  const currentModel = currentProvider.models.find((m) => m.id === formData.aiModel) || currentProvider.models[0];

  const handleProviderChange = (newProviderId: string) => {
    const selectedProvider = AI_PROVIDERS.find((p) => p.id === newProviderId) || AI_PROVIDERS[0];
    setFormData((prev) => ({
      ...prev,
      aiProvider: newProviderId,
      aiModel: selectedProvider.defaultModel,
    }));
  };

  const handleModelChange = (newModelId: string) => {
    setFormData((prev) => ({
      ...prev,
      aiModel: newModelId,
    }));
  };

  // Auto-detect models function
  const handleDetectModels = async (overrideBaseUrl?: string, overrideApiKey?: string) => {
    const targetBaseUrl = (overrideBaseUrl !== undefined ? overrideBaseUrl : formData.aiCustomBaseUrl || '').trim();
    const targetApiKey = (overrideApiKey !== undefined ? overrideApiKey : formData.aiCustomApiKey || '').trim();

    if (!targetBaseUrl) {
      setDetectStatus({
        type: 'error',
        message: 'Silakan masukkan Base URL terlebih dahulu untuk mendeteksi model.',
      });
      return;
    }

    setIsDetecting(true);
    setDetectStatus({ type: 'idle' });

    try {
      const resp = await fetch('/api/ai/detect-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: targetBaseUrl,
          apiKey: targetApiKey,
        }),
      });

      const data = await resp.json();

      if (data.success && Array.isArray(data.models) && data.models.length > 0) {
        setFormData((prev) => ({
          ...prev,
          aiDetectedModels: data.models,
          // If current custom model is empty or not in detected list, pick the first one
          aiCustomModel: prev.aiCustomModel && data.models.includes(prev.aiCustomModel)
            ? prev.aiCustomModel
            : data.models[0],
        }));

        setDetectStatus({
          type: 'success',
          count: data.count,
          endpoint: data.endpoint,
          message: `Berhasil mendeteksi ${data.count} model aktif dari endpoint!`,
        });

        showToast(`Berhasil mendeteksi ${data.count} model dari endpoint API!`, 'success');
      } else {
        setDetectStatus({
          type: 'error',
          message: data.error || 'Tidak ada model yang dapat dideteksi dari Base URL ini. Anda tetap bisa memasukkan nama model secara manual.',
        });
        showToast(data.error || 'Tidak dapat mendeteksi model otomatis', 'error');
      }
    } catch (err: any) {
      setDetectStatus({
        type: 'error',
        message: `Koneksi gagal: ${err?.message || 'Server tidak merespons'}. Pastikan endpoint Base URL aktif.`,
      });
      showToast('Gagal menghubungi endpoint untuk deteksi model', 'error');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleApplyPreset = (preset: typeof BASE_URL_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      aiCustomBaseUrl: preset.url,
      aiCustomModel: prev.aiCustomModel || preset.defaultModel,
    }));
    // Trigger auto-detect if appropriate
    handleDetectModels(preset.url, formData.aiCustomApiKey);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto font-sans-ui">
      <div>
        <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
          Konfigurasi Situs & Redaksi
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Atur identitas portal, penyedia mesin AI artikel, warna visual, jejaring sosial, dan footer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Globe className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Identitas Umum Portal
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Nama Portal / Media</label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Slogan Redaksional</label>
              <input
                type="text"
                value={formData.siteTagline}
                onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">
                Deskripsi Singkat (Meta Description Situs)
              </label>
              <textarea
                rows={2}
                value={formData.siteDescription}
                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* AI Engine Configuration Card */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                  <span>Mesin AI Redaksi (API Provider & Pilihan Model)</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-mono-code font-bold">
                    Fitur "Gunakan AI"
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Tentukan API Provider dan Model AI yang digunakan untuk menyusun teks naskah, slug, kutipan pengantar, dan konfigurasi SEO & Social Card.
                </p>
              </div>
            </div>

            {/* Quick Status Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded-lg text-[11px] font-mono-code text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Aktif: {currentProvider.name} ({formData.aiProvider === 'custom' ? (formData.aiCustomModel || 'Model Kustom') : (formData.aiModel === 'custom' ? formData.aiCustomModel || 'Kustom' : currentModel.name)})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Kolom API Provider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                  Kolom API Provider <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-neutral-500 font-mono-code">Penyedia Layanan</span>
              </div>
              
              <div className="relative">
                <select
                  value={formData.aiProvider || 'google-gemini'}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-colors cursor-pointer"
                >
                  {AI_PROVIDERS.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name} — {prov.company} ({prov.tag})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 text-[11px] text-neutral-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <span>{currentProvider.name}</span>
                  <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 text-[10px] rounded font-mono-code">
                    {currentProvider.tag}
                  </span>
                </div>
                <p className="leading-relaxed text-neutral-500">{currentProvider.desc}</p>
              </div>
            </div>

            {/* Kolom Pilihan Model */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                  Kolom Pilihan Model AI <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-neutral-500 font-mono-code">Model Bahasa</span>
              </div>

              {formData.aiProvider === 'custom' ? (
                /* Jika Custom Provider, tampilkan pilihan dari model terdeteksi atau input manual */
                <div className="space-y-2">
                  <div className="relative">
                    {formData.aiDetectedModels && formData.aiDetectedModels.length > 0 ? (
                      <select
                        value={formData.aiCustomModel || (formData.aiDetectedModels[0] || '')}
                        onChange={(e) => setFormData({ ...formData, aiCustomModel: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-colors cursor-pointer font-mono-code"
                      >
                        <optgroup label={`Model Terdeteksi (${formData.aiDetectedModels.length})`}>
                          {formData.aiDetectedModels.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData.aiCustomModel || ''}
                        onChange={(e) => setFormData({ ...formData, aiCustomModel: e.target.value })}
                        placeholder="Contoh: llama3:8b, mistral, gpt-4o..."
                        className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-xs font-mono-code focus:outline-none focus:border-purple-600 bg-white"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Model aktif: <strong className="font-mono-code text-neutral-800">{formData.aiCustomModel || 'Belum diatur'}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleDetectModels()}
                      disabled={isDetecting}
                      className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <RefreshCw className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
                      <span>Segarkan Deteksi</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Provider Bawaan (Google Gemini, OpenAI, Claude, Groq, OpenRouter) */
                <>
                  <div className="relative">
                    <select
                      value={formData.aiModel || currentProvider.defaultModel}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-colors cursor-pointer"
                    >
                      {currentProvider.models.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          {mod.name} {mod.badge ? `[${mod.badge}]` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.aiModel === 'custom' ? (
                    <div className="space-y-1 pt-1">
                      <label className="block font-semibold text-neutral-700 text-[11px]">
                        Identifier Model Kustom (Model ID)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.aiCustomModel || ''}
                        onChange={(e) => setFormData({ ...formData, aiCustomModel: e.target.value })}
                        placeholder="Contoh: gemini-2.5-pro-preview atau mistral-large-latest..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-mono-code focus:outline-none focus:border-purple-600 bg-white"
                      />
                      <p className="text-[10px] text-neutral-400">
                        Masukkan nama identifier model spesifik yang disediakan oleh API provider Anda.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 text-[11px] text-neutral-600 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                        <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{currentModel.name}</span>
                        {currentModel.badge && (
                          <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[10px] rounded font-mono-code">
                            {currentModel.badge}
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed text-neutral-500">{currentModel.desc}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Dedicated Custom Provider Box: API Key, Base URL & Auto-Detect Model */}
          <div className={`p-4 rounded-xl border transition-all ${
            formData.aiProvider === 'custom'
              ? 'bg-purple-50/40 border-purple-300 shadow-xs'
              : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/70 mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                    <span>Pengaturan Endpoint Kustom Provider</span>
                    {formData.aiProvider === 'custom' ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                        Sedang Digunakan
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-[10px]">
                        Tersedia untuk Diaktifkan
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Masukkan Base URL dan API Key server Anda. Sistem dapat mendeteksi daftar model secara otomatis.
                  </p>
                </div>
              </div>

              {formData.aiProvider !== 'custom' && (
                <button
                  type="button"
                  onClick={() => handleProviderChange('custom')}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Zap className="w-3 h-3 text-yellow-300" />
                  <span>Jadikan Mesin Aktif</span>
                </button>
              )}
            </div>

            {/* Quick Presets for Base URL */}
            <div className="mb-3">
              <div className="text-[11px] font-semibold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3 h-3 text-purple-600" />
                <span>Pilihan Cepat Preset Base URL:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BASE_URL_PRESETS.map((preset) => {
                  const currentClean = (formData.aiCustomBaseUrl || '').trim().replace(/\/+$/, '');
                  const presetClean = preset.url.trim().replace(/\/+$/, '');
                  const isCurrent = currentClean === presetClean;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                        isCurrent
                          ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-purple-400 hover:bg-purple-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Kolom Base URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-neutral-800 text-[11px]">
                    Base URL API (Endpoint OpenAI-Compatible) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono-code">/v1/models</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.aiCustomBaseUrl || ''}
                    onChange={(e) => setFormData({ ...formData, aiCustomBaseUrl: e.target.value })}
                    onBlur={() => {
                      if (formData.aiCustomBaseUrl && (!formData.aiDetectedModels || formData.aiDetectedModels.length === 0)) {
                        handleDetectModels();
                      }
                    }}
                    placeholder="Contoh: http://localhost:11434/v1 atau https://api.openai.com/v1"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-mono-code focus:outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 leading-normal">
                  Mendukung endpoint OpenAI standar (misal Ollama <code>/v1</code>, LM Studio, vLLM, DeepSeek, Groq, atau OpenRouter).
                </p>
              </div>

              {/* Kolom API Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-neutral-800 text-[11px]">
                    API Key (Kunci Otorisasi)
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono-code">Bearer Token</span>
                </div>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.aiCustomApiKey || ''}
                    onChange={(e) => setFormData({ ...formData, aiCustomApiKey: e.target.value })}
                    placeholder="sk-xxxxxxxx (kosongkan jika server lokal tanpa otentikasi)"
                    className="w-full pl-3 pr-10 py-2 border border-neutral-300 rounded-lg text-xs font-mono-code focus:outline-none focus:border-purple-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    title={showApiKey ? 'Sembunyikan API Key' : 'Tampilkan API Key'}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 leading-normal">
                  Kunci otorisasi disimpan aman di konfigurasi redaksi dan tidak disebarkan ke publik.
                </p>
              </div>
            </div>

            {/* Auto-detect Trigger Bar & Status */}
            <div className="mt-4 pt-3 border-t border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => handleDetectModels()}
                  disabled={isDetecting}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-semibold flex items-center gap-2 transition-colors text-xs shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin text-purple-300' : ''}`} />
                  <span>{isDetecting ? 'Mendeteksi Model...' : 'Deteksi Model Otomatis'}</span>
                </button>

                {detectStatus.type === 'success' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{detectStatus.message || `Terdeteksi ${detectStatus.count} model aktif.`}</span>
                  </span>
                )}

                {detectStatus.type === 'error' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="max-w-md truncate">{detectStatus.message}</span>
                  </span>
                )}
              </div>

              {/* Quick Model Selector when models detected */}
              {formData.aiDetectedModels && formData.aiDetectedModels.length > 0 && (
                <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                  <span className="text-[11px] font-semibold text-neutral-600 shrink-0">Model Terpilih:</span>
                  <input
                    type="text"
                    value={formData.aiCustomModel || ''}
                    onChange={(e) => setFormData({ ...formData, aiCustomModel: e.target.value })}
                    placeholder="Nama model..."
                    className="px-2.5 py-1 rounded-md border border-neutral-300 text-xs font-mono-code bg-white focus:outline-none focus:border-purple-600 w-full sm:w-44"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional AI Options: Default Tone & Architecture Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Gaya Bahasa Redaksional Bawaan (Default Editorial Tone)
              </label>
              <select
                value={formData.aiDefaultTone || 'Jurnalistik Obyektif & Analitis'}
                onChange={(e) => setFormData({ ...formData, aiDefaultTone: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
              >
                <option value="Jurnalistik Obyektif & Analitis">Jurnalistik Obyektif & Analitis (Netral, Berimbang, Kaya Data)</option>
                <option value="Strategis & Praktis Bisnis">Strategis Bisnis & Eksekutif (Solutif & Taktis)</option>
                <option value="Opini Kritis & Inspiratif">Opini Kritis & Berbobot (Tajam & Visioner)</option>
                <option value="Edukatif & Populer">Edukatif & Populer (Mudah Dipahami, Ramah Pembaca)</option>
              </select>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-purple-50/60 border border-purple-200/70 text-purple-900 text-[11px]">
              <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Keamanan Kunci API Server-Side</span>
                <p className="text-purple-700/90 leading-relaxed mt-0.5">
                  Permintaan generasi AI dijalankan secara aman melalui server internal (<code>/api/ai/generate-article</code>). Token dan kunci API dikelola di sisi server tanpa terpapar ke browser pengunjung.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Styling */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Palette className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Warna Identitas Visual
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Warna Aksen Utama</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded border border-neutral-300 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg font-mono-code"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Warna Aksen Sekunder</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded border border-neutral-300 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg font-mono-code"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Tautan Saluran Resmi Media Sosial
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Twitter / X</label>
              <input
                type="url"
                value={formData.twitter || ''}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://x.com/newsroom"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Instagram</label>
              <input
                type="url"
                value={formData.instagram || ''}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/newsroom"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin || ''}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/newsroom"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">YouTube Channel</label>
              <input
                type="url"
                value={formData.youtube || ''}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://youtube.com/@newsroom"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Pengaturan Footer & Hak Cipta
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Deskripsi Footer</label>
              <textarea
                rows={2}
                value={formData.footerDescription}
                onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Teks Hak Cipta (Copyright)</label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none font-mono-code text-[11px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
