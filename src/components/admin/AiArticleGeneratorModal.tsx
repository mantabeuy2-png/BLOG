import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { useCms } from '../../context/CmsContext';
import {
  Sparkles,
  X,
  Wand2,
  FileText,
  Search,
  Share2,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Clock,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  Eye,
  Bot,
  Cpu
} from 'lucide-react';

export interface AiGeneratedArticleResult {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  tags: string[];
  categorySuggestion?: string;
  ogTitle?: string;
  ogDescription?: string;
  wordCount?: number;
  readingTime?: string;
  _generatedBy?: string;
}

interface AiArticleGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  categories: Category[];
  currentCategoryId?: string;
  onApply: (data: AiGeneratedArticleResult) => void;
}

const WORD_COUNT_PRESETS = [
  { value: 300, label: '300 Kata', desc: 'Ringkas & Padat (Flash News / Brief)' },
  { value: 600, label: '600 Kata', desc: 'Standar Editorial (Ulasan Lengkap)' },
  { value: 1000, label: '1.000 Kata', desc: 'Mendalam & Analitis (In-depth Feature)' },
  { value: 1500, label: '1.500 Kata', desc: 'Investigatif / Long-form Spesial' },
];

const TITLE_INSPIRATIONS = [
  'Strategi Adopsi AI & Otomasi untuk Skala Bisnis Indonesia 2026',
  'Panduan SEO Modern: Merajai Peringkat Teratas di Era Mesin Pencari Cerdas',
  'Optimalisasi Digital Marketing & Omnichannel untuk Meningkatkan Penjualan',
  'Membangun Budaya Kerja Berbasis Data di Tengah Gelombang Disrupsi Teknologi',
  'Tren Desain Web & Pengalaman Pengguna (UX) yang Mengonversi di 2026',
];

const EDITORIAL_TONES = [
  { id: 'Jurnalistik Obyektif & Analitis', label: 'Jurnalistik Obyektif', desc: 'Baku, netral, berimbang, kaya data' },
  { id: 'Strategis & Praktis Bisnis', label: 'Strategis Bisnis', desc: 'Solutif, panduan taktis, aplikatif' },
  { id: 'Opini Kritis & Inspiratif', label: 'Opini Kritis', desc: 'Sudut pandang tajam, visioner' },
  { id: 'Edukatif & Populer', label: 'Edukatif Populer', desc: 'Mudah dipahami, ramah pemula' },
];

export const AiArticleGeneratorModal: React.FC<AiArticleGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialTitle = '',
  categories,
  currentCategoryId,
  onApply,
}) => {
  const { settings } = useCms();
  const activeProvider = settings.aiProvider || 'google-gemini';
  const activeModel = activeProvider === 'custom'
    ? (settings.aiCustomModel || 'llama3:8b')
    : (settings.aiModel === 'custom' ? settings.aiCustomModel : settings.aiModel) || 'gemini-2.5-flash';

  const [title, setTitle] = useState(initialTitle);
  const [selectedWordPreset, setSelectedWordPreset] = useState<number | 'custom'>(600);
  const [customWordCount, setCustomWordCount] = useState<number>(800);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const found = categories.find((c) => c.id === currentCategoryId);
    return found ? found.name : (categories[0]?.name || 'Teknologi');
  });
  const [selectedTone, setSelectedTone] = useState<string>(
    settings.aiDefaultTone || EDITORIAL_TONES[0].id
  );
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [generatedData, setGeneratedData] = useState<AiGeneratedArticleResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'content' | 'seo' | 'social'>('content');

  // Sync initial title if changed from editor
  useEffect(() => {
    if (initialTitle && !title) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  if (!isOpen) return null;

  const targetWords = selectedWordPreset === 'custom' ? customWordCount : selectedWordPreset;

  const handleGenerate = async () => {
    if (!title.trim()) {
      setErrorMsg('Mohon masukkan judul artikel terlebih dahulu.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setGenerationStep(1);

    // Step progression animation for delightful editorial feel
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1200);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 2600);
    const stepTimer3 = setTimeout(() => setGenerationStep(4), 4000);

    try {
      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          targetWords,
          category: selectedCategory,
          tone: selectedTone,
          additionalNotes: additionalNotes.trim(),
          provider: activeProvider,
          model: activeModel,
          baseUrl: settings.aiCustomBaseUrl || '',
          apiKey: settings.aiCustomApiKey || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result: AiGeneratedArticleResult = await response.json();
      setGeneratedData(result);
    } catch (err: any) {
      console.error('Error during AI generation:', err);
      setErrorMsg('Gagal menghasilkan artikel melalui AI. Silakan periksa koneksi atau coba kembali.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleApplyToEditor = () => {
    if (!generatedData) return;
    onApply(generatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans-ui">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-serif-editorial text-white tracking-tight">
                  Asisten Redaksi AI — Buat Naskah Lengkap
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono-code font-semibold border border-purple-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{activeProvider === 'google-gemini' ? 'Google Gemini' : (activeProvider === 'custom' ? 'Kustom Provider' : activeProvider)}</span>
                  <span className="text-neutral-500">•</span>
                  <span className="truncate max-w-[140px]">{activeModel}</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Tuliskan judul artikel, lalu AI akan menyusun isi teks, slug, kutipan pengantar, dan konfigurasi SEO & Social Card.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* If Result is Ready: Show Interactive Preview & Review */}
          {generatedData ? (
            <div className="space-y-6">
              {/* Top Banner indicating editable outcome */}
              <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs text-emerald-900">
                  <p className="font-bold text-sm text-emerald-950 mb-0.5">
                    Naskah Berhasil Disusun oleh AI!
                  </p>
                  <p className="text-emerald-800 leading-relaxed">
                    Setelah Anda menekan <strong>"Terapkan ke Editor"</strong>, seluruh teks, slug, kutipan pengantar, dan konfigurasi SEO akan langsung masuk ke form editor. <strong>Anda tetap bebas menyunting, menambah data, atau mengubah setiap kalimat sesuai kebutuhan Anda.</strong>
                  </p>
                </div>
              </div>

              {/* Metric Pill Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Target & Realisasi</span>
                  <span className="text-sm font-bold text-neutral-900 mt-0.5 block font-mono-code">
                    ~{generatedData.wordCount || targetWords} Kata
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Waktu Baca</span>
                  <span className="text-sm font-bold text-neutral-900 mt-0.5 block font-mono-code">
                    {generatedData.readingTime || '3 mnt baca'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Kategori Disarankan</span>
                  <span className="text-sm font-bold text-neutral-900 mt-0.5 block truncate">
                    {generatedData.categorySuggestion || selectedCategory}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Kesiapan SEO</span>
                  <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                    Optimal (Skor 95)
                  </span>
                </div>
              </div>

              {/* Preview Navigation Tabs */}
              <div className="flex border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => setPreviewTab('content')}
                  className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                    previewTab === 'content'
                      ? 'border-purple-600 text-purple-700 font-bold'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Isi Teks & Kutipan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('seo')}
                  className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                    previewTab === 'seo'
                      ? 'border-purple-600 text-purple-700 font-bold'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Konfigurasi SEO Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('social')}
                  className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                    previewTab === 'social'
                      ? 'border-purple-600 text-purple-700 font-bold'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Social Card (Open Graph)</span>
                </button>
              </div>

              {/* Tab 1: Content Preview */}
              {previewTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Judul Hasil Generasi
                    </label>
                    <input
                      type="text"
                      value={generatedData.title}
                      onChange={(e) => setGeneratedData({ ...generatedData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-base font-serif-editorial font-bold border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={generatedData.slug}
                        onChange={(e) => setGeneratedData({ ...generatedData, slug: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono-code border border-neutral-300 rounded-lg bg-neutral-50 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        Kata Kunci Utama (Focus Keyword)
                      </label>
                      <input
                        type="text"
                        value={generatedData.focusKeyword}
                        onChange={(e) => setGeneratedData({ ...generatedData, focusKeyword: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-neutral-50 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Kutipan Pengantar (Excerpt)
                    </label>
                    <textarea
                      rows={2}
                      value={generatedData.excerpt}
                      onChange={(e) => setGeneratedData({ ...generatedData, excerpt: e.target.value })}
                      className="w-full p-3 text-xs leading-relaxed border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Pratinjau Format Teks Naskah (HTML)
                      </label>
                      <span className="text-[11px] text-neutral-400">
                        Dapat disunting bebas setelah diterapkan ke editor
                      </span>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 max-h-72 overflow-y-auto font-sans-ui text-sm leading-relaxed space-y-3 prose prose-sm max-w-none text-neutral-800">
                      <div dangerouslySetInnerHTML={{ __html: generatedData.content }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Tagar / Topik Relevan
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedData.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-md border border-neutral-200 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: SEO Preview */}
              {previewTab === 'seo' && (
                <div className="space-y-4">
                  {/* Google SERP Card Preview */}
                  <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Pratinjau Tampilan Google Search
                    </span>
                    <div className="text-xs font-sans">
                      <span className="text-[11px] text-neutral-500 block truncate">
                        https://agenx.id › article › {generatedData.slug}
                      </span>
                      <h4 className="text-sm font-medium text-[#1a0dab] hover:underline truncate mt-0.5">
                        {generatedData.seoTitle}
                      </h4>
                      <p className="text-xs text-[#4d5156] line-clamp-2 mt-1 leading-relaxed">
                        {generatedData.metaDescription}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-neutral-700">SEO Title</label>
                        <span className="text-[11px] text-neutral-400">
                          {generatedData.seoTitle.length} / 60 karakter
                        </span>
                      </div>
                      <input
                        type="text"
                        value={generatedData.seoTitle}
                        onChange={(e) => setGeneratedData({ ...generatedData, seoTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-neutral-700">Meta Description</label>
                        <span className="text-[11px] text-neutral-400">
                          {generatedData.metaDescription.length} / 160 karakter
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={generatedData.metaDescription}
                        onChange={(e) => setGeneratedData({ ...generatedData, metaDescription: e.target.value })}
                        className="w-full p-2.5 text-xs leading-relaxed border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Social Card Preview */}
              {previewTab === 'social' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Pratinjau Open Graph (WhatsApp, LinkedIn, X, Facebook)
                    </span>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800">
                      <div className="h-32 bg-gradient-to-r from-neutral-800 to-neutral-700 flex items-center justify-center text-neutral-400 text-xs">
                        [ Gambar Sampul Naskah Utama ]
                      </div>
                      <div className="p-3 bg-neutral-950">
                        <span className="text-[10px] uppercase font-mono-code text-neutral-400 block">AGENX.ID</span>
                        <h5 className="text-sm font-bold text-white mt-0.5 truncate">
                          {generatedData.ogTitle || generatedData.seoTitle}
                        </h5>
                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                          {generatedData.ogDescription || generatedData.metaDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Judul Social Card (og:title)
                      </label>
                      <input
                        type="text"
                        value={generatedData.ogTitle || ''}
                        onChange={(e) => setGeneratedData({ ...generatedData, ogTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Deskripsi Social Card (og:description)
                      </label>
                      <textarea
                        rows={2}
                        value={generatedData.ogDescription || ''}
                        onChange={(e) => setGeneratedData({ ...generatedData, ogDescription: e.target.value })}
                        className="w-full p-2.5 text-xs leading-relaxed border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : isGenerating ? (
            /* Loading State with Progress Steps */
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-xl animate-pulse">
                  <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h4 className="text-lg font-bold font-serif-editorial text-neutral-900">
                  Menyusun Naskah dengan Gemini AI...
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Sedang meneliti sudut pandang, merangkai argumen editorial berkualitas, membuat slug ramah SEO, dan mengoptimalkan kartu pratinjau media sosial.
                </p>
              </div>

              {/* Progress Milestones */}
              <div className="w-full max-w-sm bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-left space-y-2.5 text-xs">
                <div className={`flex items-center gap-2 ${generationStep >= 1 ? 'text-purple-600 font-semibold' : 'text-neutral-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${generationStep >= 1 ? 'bg-purple-600 animate-ping' : 'bg-neutral-300'}`} />
                  <span>1. Menganalisis judul & sudut pandang editorial...</span>
                </div>
                <div className={`flex items-center gap-2 ${generationStep >= 2 ? 'text-purple-600 font-semibold' : 'text-neutral-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${generationStep >= 2 ? 'bg-purple-600 animate-ping' : 'bg-neutral-300'}`} />
                  <span>2. Menulis isi artikel lengkap (~{targetWords} kata)...</span>
                </div>
                <div className={`flex items-center gap-2 ${generationStep >= 3 ? 'text-purple-600 font-semibold' : 'text-neutral-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${generationStep >= 3 ? 'bg-purple-600 animate-ping' : 'bg-neutral-300'}`} />
                  <span>3. Menyusun URL slug & kutipan pengantar...</span>
                </div>
                <div className={`flex items-center gap-2 ${generationStep >= 4 ? 'text-purple-600 font-semibold' : 'text-neutral-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${generationStep >= 4 ? 'bg-purple-600 animate-ping' : 'bg-neutral-300'}`} />
                  <span>4. Mengonfigurasi SERP SEO & Social Card...</span>
                </div>
              </div>
            </div>
          ) : (
            /* Input & Configuration Form */
            <div className="space-y-6">
              {/* Field: Judul Artikel */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Judul Artikel yang Ingin Dibuat <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Strategi AI dan Digital Marketing untuk Bisnis Indonesia 2026..."
                  className="w-full px-4 py-3 text-base font-serif-editorial font-bold border border-neutral-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all shadow-2xs"
                  autoFocus
                />

                {/* Quick Title Inspirations */}
                <div className="mt-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inspirasi Judul Cepat (Klik untuk memilih):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TITLE_INSPIRATIONS.map((insp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTitle(insp)}
                        className="px-2.5 py-1 text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-left"
                      >
                        {insp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field: Pilihan Panjang Artikel dalam Kata */}
              <div className="p-4 bg-neutral-50/80 rounded-xl border border-neutral-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-600" />
                    <span>Pilihan Jumlah Panjang Artikel (Kata)</span>
                  </label>
                  <span className="text-xs font-mono-code font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Target: ~{targetWords} Kata
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {WORD_COUNT_PRESETS.map((preset) => {
                    const isSelected = selectedWordPreset === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setSelectedWordPreset(preset.value)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-50/80 border-purple-600 shadow-xs ring-1 ring-purple-600/30'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${isSelected ? 'text-purple-900' : 'text-neutral-900'}`}>
                            {preset.label}
                          </span>
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-neutral-400'}`} />
                        </div>
                        <span className="text-[11px] text-neutral-500 mt-1 leading-snug">
                          {preset.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Option for Custom Word Count */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedWordPreset('custom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedWordPreset === 'custom'
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300'
                    }`}
                  >
                    Atur Jumlah Kata Kustom
                  </button>

                  {selectedWordPreset === 'custom' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={100}
                        max={3000}
                        step={50}
                        value={customWordCount}
                        onChange={(e) => setCustomWordCount(Math.max(100, parseInt(e.target.value) || 100))}
                        className="w-24 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg font-mono-code focus:outline-none focus:border-purple-600"
                      />
                      <span className="text-xs text-neutral-500">kata (rentang 100 - 3.000 kata)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Two Column Setup: Kategori & Gaya Bahasa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Kanal / Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-purple-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Opini & Esai">Opini & Esai</option>
                    <option value="Sains & Tren">Sains & Tren</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Gaya Bahasa / Tone Redaksi
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-purple-600"
                  >
                    {EDITORIAL_TONES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} — {t.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional: Catatan Khusus / Poin Kunci */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Catatan Tambahan atau Poin Kunci (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Contoh: Tekankan studi kasus lokal di Jakarta, sertakan data persentase penetrasi mobile, dan kutipan mengenai ketangkasan organisasi..."
                  className="w-full p-3 text-xs leading-relaxed border border-neutral-300 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Transparency Notice */}
              <div className="p-3 bg-neutral-100/70 rounded-xl text-neutral-600 text-[11px] leading-relaxed flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>
                  <strong>Fleksibilitas Penuh:</strong> Naskah yang dihasilkan AI akan terisi otomatis ke formulir editor lengkap dengan seluruh opsi metadata, dan tetap dapat Anda sesuaikan, hapus, maupun kembangkan sesuai visi editorial Anda.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          {generatedData ? (
            <>
              <button
                type="button"
                onClick={() => setGeneratedData(null)}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 rounded-xl text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Buat Ulang / Ganti Judul</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleApplyToEditor}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Terapkan ke Editor Naskah</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 rounded-xl text-xs font-semibold text-neutral-700 transition-colors disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !title.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:shadow-lg cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-yellow-300" />
                <span>{isGenerating ? 'Menyusun Naskah...' : 'Mulai Buat dengan AI'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
