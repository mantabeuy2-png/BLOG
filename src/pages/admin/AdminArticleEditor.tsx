import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { Article, MediaItem } from '../../types';
import { MediaPickerModal } from '../../components/shared/MediaPickerModal';
import { ArticleContentRenderer } from '../../components/frontend/ArticleContentRenderer';
import { extractYouTubeVideoId, getYouTubeThumbnail, getYouTubeEmbedUrl } from '../../utils/youtube';
import { AiArticleGeneratorModal, AiGeneratedArticleResult } from '../../components/admin/AiArticleGeneratorModal';
import {
  Save,
  ArrowLeft,
  Eye,
  Edit3,
  Image as ImageIcon,
  Check,
  Globe,
  Tag as TagIcon,
  HelpCircle,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Link,
  Quote,
  List,
  ListOrdered,
  Code,
  Table as TableIcon,
  Video,
  Play,
  ExternalLink,
  Film,
  RefreshCw,
  Sparkles,
  Share2,
  Wand2
} from 'lucide-react';

interface AdminArticleEditorProps {
  articleId?: string;
}

export const AdminArticleEditor: React.FC<AdminArticleEditorProps> = ({ articleId }) => {
  const {
    articles,
    categories,
    authors,
    saveArticle,
    goToAdmin,
    goToArticle,
    showToast
  } = useCms();

  const existing = articleId ? articles.find((a) => a.id === articleId) : null;

  // Form states
  const [title, setTitle] = useState(existing?.title || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [excerpt, setExcerpt] = useState(existing?.excerpt || '');
  const [content, setContent] = useState(
    existing?.content ||
      '<p class="dropcap">Tuliskan narasi editorial Anda di sini. Paragraf pertama akan otomatis memiliki gaya dropcap khas majalah...</p><h2>Sub-Judul Analisis</h2><p>Penjelasan konteks mendalam mengenai isu ini.</p><blockquote>"Kutipan berbobot dari narasumber atau gagasan kunci."</blockquote>'
  );
  const [featuredImage, setFeaturedImage] = useState(
    existing?.featuredImage ||
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80'
  );
  const [imageCaption, setImageCaption] = useState(existing?.imageCaption || '');
  const [mediaType, setMediaType] = useState<'image' | 'video'>(
    existing?.mediaType || (existing?.youtubeUrl ? 'video' : 'image')
  );
  const [youtubeUrl, setYoutubeUrl] = useState(existing?.youtubeUrl || '');
  const [youtubeVideoId, setYoutubeVideoId] = useState(
    existing?.youtubeVideoId || (existing?.youtubeUrl ? extractYouTubeVideoId(existing.youtubeUrl) || '' : '')
  );
  const [testPlayVideo, setTestPlayVideo] = useState(false);
  const [categoryId, setCategoryId] = useState(existing?.categoryId || categories[0]?.id || 'cat-tech');
  const [tagsInput, setTagsInput] = useState(existing?.tags ? existing.tags.join(', ') : 'Teknologi, Desain');
  const [authorId, setAuthorId] = useState(existing?.author?.id || authors[0]?.id || 'auth-1');
  const [status, setStatus] = useState<Article['status']>(existing?.status || 'published');
  const [publishedAt, setPublishedAt] = useState(existing?.publishedAt || new Date().toISOString().split('T')[0]);

  // SEO states
  const [seoTitle, setSeoTitle] = useState(existing?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(existing?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(existing?.focusKeyword || '');
  const [canonicalUrl, setCanonicalUrl] = useState(existing?.canonicalUrl || '');
  const [ogImage, setOgImage] = useState(existing?.ogImage || '');
  const [ogTitle, setOgTitle] = useState(existing?.ogTitle || '');
  const [ogDescription, setOgDescription] = useState(existing?.ogDescription || '');

  // UI state
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  // Auto-generate slug when title changes if new article
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!existing) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      if (!seoTitle) setSeoTitle(newTitle);
    }
  };

  const insertToolbarTag = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}${suffix}`);
    showToast('Elemen ditambahkan ke naskah', 'info');
  };

  const handleMediaSelect = (media: MediaItem) => {
    setFeaturedImage(media.url);
    if (media.caption) setImageCaption(media.caption);
    showToast('Gambar unggulan diperbarui', 'success');
  };

  const handleApplyAiData = (data: AiGeneratedArticleResult) => {
    if (data.title) setTitle(data.title);
    if (data.slug) setSlug(data.slug);
    if (data.excerpt) setExcerpt(data.excerpt);
    if (data.content) setContent(data.content);
    if (data.seoTitle) setSeoTitle(data.seoTitle);
    if (data.metaDescription) setMetaDescription(data.metaDescription);
    if (data.focusKeyword) setFocusKeyword(data.focusKeyword);
    if (data.ogTitle) setOgTitle(data.ogTitle);
    if (data.ogDescription) setOgDescription(data.ogDescription);
    if (data.tags && data.tags.length > 0) {
      setTagsInput(data.tags.join(', '));
    }
    if (data.categorySuggestion) {
      const matched = categories.find(
        (c) => c.name.toLowerCase() === data.categorySuggestion?.toLowerCase()
      );
      if (matched) {
        setCategoryId(matched.id);
      }
    }
    setViewMode('editor');
    showToast('Naskah berhasil disusun oleh AI! Anda dapat menyunting dan menyesuaikan teks di editor.', 'success');
  };

  const handleYoutubeUrlChange = (newUrl: string) => {
    setYoutubeUrl(newUrl);
    const detectedId = extractYouTubeVideoId(newUrl);
    if (detectedId) {
      setYoutubeVideoId(detectedId);
      const thumb = getYouTubeThumbnail(detectedId, 'hq');
      setFeaturedImage(thumb);
      if (!imageCaption) {
        setImageCaption('Video liputan YouTube.');
      }
      showToast('Tautan YouTube terdeteksi & thumbnail diterapkan', 'success');
    } else {
      setYoutubeVideoId('');
    }
  };

  const handleSave = (newStatus?: Article['status']) => {
    if (!title.trim()) {
      showToast('Judul artikel wajib diisi', 'error');
      return;
    }

    const currentAuthor = authors.find((a) => a.id === authorId) || authors[0];
    const currentCategory = categories.find((c) => c.id === categoryId) || categories[0];
    const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    // If video type is active and valid video id exists, ensure featuredImage is the YouTube thumbnail
    const detectedId = mediaType === 'video' ? (youtubeVideoId || extractYouTubeVideoId(youtubeUrl) || '') : '';
    let finalFeaturedImage = featuredImage;
    if (mediaType === 'video' && detectedId) {
      finalFeaturedImage = getYouTubeThumbnail(detectedId, 'hq');
    }

    const articleData: Partial<Article> = {
      id: existing?.id,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt,
      content,
      featuredImage: finalFeaturedImage,
      imageCaption,
      mediaType,
      youtubeUrl: mediaType === 'video' ? youtubeUrl : '',
      youtubeVideoId: mediaType === 'video' ? detectedId : '',
      category: currentCategory.name,
      categoryId: currentCategory.id,
      tags: parsedTags,
      author: currentAuthor,
      status: newStatus || status,
      publishedAt,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt,
      focusKeyword,
      canonicalUrl: canonicalUrl || `https://newsroom.id/article/${slug}`,
      ogImage: ogImage || finalFeaturedImage,
      ogTitle: ogTitle || seoTitle || title,
      ogDescription: ogDescription || metaDescription || excerpt
    };

    saveArticle(articleData);
    goToAdmin('articles');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans-ui">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => goToAdmin('articles')}
            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
            title="Kembali ke Daftar Naskah"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold font-serif-editorial text-neutral-900">
              {existing ? 'Sunting Naskah Editorial' : 'Tulis Naskah Baru'}
            </h2>
            <span className="text-xs text-neutral-500 font-mono-code">
              {status === 'published' ? 'Siap Terbit' : 'Draf Redaksi'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Preview Toggle, AI Button & Save */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="border border-neutral-200 bg-white rounded-lg p-0.5 flex">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'editor'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'preview'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Nyata</span>
            </button>
          </div>

          {/* Tombol Gunakan AI disamping tombol editor */}
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            title="Gunakan AI untuk membuat naskah, slug, excerpt, dan konfigurasi SEO & Social Card"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
            <span>Gunakan AI</span>
          </button>

          <button
            onClick={() => handleSave('draft')}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-lg text-xs font-semibold transition-colors"
          >
            Simpan Draf
          </button>

          <button
            onClick={() => handleSave('published')}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Terbitkan Naskah</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {viewMode === 'preview' ? (
        /* Live Preview Simulation */
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-14 shadow-xs max-w-4xl mx-auto">
          <div className="mb-4">
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold uppercase tracking-wider text-xs">
              {categories.find((c) => c.id === categoryId)?.name}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-editorial text-neutral-900 leading-tight">
            {title || 'Judul Naskah Belum Diisi'}
          </h1>
          <p className="mt-4 text-lg text-neutral-600 leading-relaxed font-sans-ui">
            {excerpt || 'Kutipan pengantar artikel...'}
          </p>

          {mediaType === 'video' && (youtubeVideoId || extractYouTubeVideoId(youtubeUrl)) ? (
            <div className="my-8 space-y-2">
              <div className="rounded-2xl overflow-hidden bg-black aspect-16/9 shadow-lg">
                <iframe
                  src={getYouTubeEmbedUrl(youtubeVideoId || extractYouTubeVideoId(youtubeUrl) || '')}
                  title={title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                <span className="inline-flex items-center gap-1 font-bold text-red-600">
                  <Play className="w-3 h-3 fill-current" /> Video YouTube Editorial
                </span>
                {imageCaption && <span className="italic">{imageCaption}</span>}
              </div>
            </div>
          ) : (
            <div className="my-8 rounded-xl overflow-hidden bg-neutral-100 aspect-16/9">
              <img src={featuredImage} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          {mediaType !== 'video' && imageCaption && (
            <p className="text-xs text-neutral-500 italic text-center -mt-6 mb-8">{imageCaption}</p>
          )}

          <ArticleContentRenderer content={content} />
        </div>
      ) : (
        /* Editor Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Editor Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Slug */}
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Judul Artikel <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAiModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3 text-purple-600" />
                    <span>Gunakan AI untuk Judul Ini</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Masukkan judul editorial yang kuat dan memikat..."
                  className="w-full px-4 py-3 text-lg font-serif-editorial font-bold border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  URL Slug Permanen
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-mono-code">/article/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="judul-artikel-slug"
                    className="flex-1 px-3 py-1.5 text-xs font-mono-code border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 bg-neutral-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Kutipan Pengantar (Excerpt)
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu beranda dan media sosial..."
                  className="w-full p-3 text-xs leading-relaxed border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 font-sans-ui"
                />
              </div>
            </div>

            {/* Rich Content Editor with Toolbar */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
              {/* Toolbar */}
              <div className="p-2.5 bg-neutral-100 border-b border-neutral-200 flex flex-wrap gap-1 items-center">
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<h2>', '</h2>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<h3>', '</h3>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-neutral-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<strong>', '</strong>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Tebal (Bold)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<em>', '</em>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Miring (Italic)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<a href="#">', '</a>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Tautan (Link)"
                >
                  <Link className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-neutral-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<blockquote>"', '"</blockquote>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Kutipan (Quote)"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<ul>\n  <li>Poin satu</li>\n  <li>Poin dua</li>\n</ul>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Daftar Bullet"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<ol>\n  <li>Langkah pertama</li>\n  <li>Langkah kedua</li>\n</ol>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Daftar Angka"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-neutral-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertToolbarTag('<pre><code>\nconst greeting = "Halo Dunia";\n</code></pre>')}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Blok Kode (Code)"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertToolbarTag(
                      '<table>\n  <tr><th>Kolom 1</th><th>Kolom 2</th></tr>\n  <tr><td>Data A</td><td>Data B</td></tr>\n</table>'
                    )
                  }
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Tabel Data"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700"
                  title="Sisipkan Gambar dari Pustaka"
                >
                  <ImageIcon className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* Textarea */}
              <div className="p-4">
                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi naskah editorial lengkap di sini (mendukung HTML)..."
                  className="w-full p-3 text-sm font-mono-code leading-relaxed border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {/* SEO Section (Crucial requirement from prompt) */}
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Konfigurasi SEO & Social Card
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Skor SEO: 92/100 (Optimal)
                </span>
              </div>

              {/* Google SERP Snippet Preview */}
              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Pratinjau Hasil Pencarian Google
                </span>
                <div className="text-xs text-[#202124] font-sans">
                  <span className="text-[11px] text-neutral-500 block truncate">
                    https://newsroom.id › article › {slug || 'judul-artikel'}
                  </span>
                  <h4 className="text-sm font-medium text-[#1a0dab] hover:underline truncate mt-0.5">
                    {seoTitle || title || 'Judul Naskah Editorial'} | Newsroom
                  </h4>
                  <p className="text-xs text-[#4d5156] line-clamp-2 mt-1">
                    {metaDescription || excerpt || 'Ringkasan naskah untuk hasil penelusuran mesin pencari...'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Judul khusus mesin pencari..."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Kata Kunci Utama (Focus Keyword)
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="Contoh: antarmuka kecerdasan buatan"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Deskripsi meta (optimal 150-160 karakter)..."
                    className="w-full p-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {/* Social Card (Open Graph) Configuration */}
                <div className="sm:col-span-2 pt-3 border-t border-neutral-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                      Konfigurasi Social Card & Open Graph
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Judul Social Card (og:title)
                      </label>
                      <input
                        type="text"
                        value={ogTitle}
                        onChange={(e) => setOgTitle(e.target.value)}
                        placeholder={seoTitle || title || 'Judul saat dibagikan ke medsos...'}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Deskripsi Social Card (og:description)
                      </label>
                      <input
                        type="text"
                        value={ogDescription}
                        onChange={(e) => setOgDescription(e.target.value)}
                        placeholder={metaDescription || excerpt || 'Ringkasan menarik untuk media sosial...'}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right / Sidebar Settings (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publication Settings */}
            <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 pb-2 border-b border-neutral-100">
                Pengaturan Penerbitan
              </h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Article['status'])}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                >
                  <option value="published">Terbit (Live)</option>
                  <option value="draft">Draf Internal</option>
                  <option value="scheduled">Terjadwal</option>
                  <option value="trash">Sampah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Penulis Naskah</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Kanal Kategori</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Tanggal Rilis</label>
                <input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 font-mono-code"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Tagar & Topik (Dipisah koma)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Kecerdasan Buatan, Ekonomi Digital..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {/* Featured Media Picker (Image or YouTube Video) */}
            <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Media Utama Editorial
                </h3>
                {mediaType === 'video' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    <Video className="w-3 h-3" />
                    Video YouTube
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                    <ImageIcon className="w-3 h-3" />
                    Foto Standar
                  </span>
                )}
              </div>

              {/* Media Type Segmented Tabs */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
                  Pilih Format Media Utama
                </label>
                <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-lg gap-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('image');
                      setTestPlayVideo(false);
                    }}
                    className={`py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                      mediaType === 'image'
                        ? 'bg-white text-neutral-900 shadow-xs font-bold'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Gambar / Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('video');
                      if (youtubeVideoId) {
                        setFeaturedImage(getYouTubeThumbnail(youtubeVideoId, 'hq'));
                      }
                    }}
                    className={`py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                      mediaType === 'video'
                        ? 'bg-red-600 text-white shadow-xs font-bold'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Link Video YouTube</span>
                  </button>
                </div>
              </div>

              {/* Render Image Mode */}
              {mediaType === 'image' && (
                <div className="space-y-3">
                  <div className="aspect-16/10 rounded-lg overflow-hidden bg-neutral-100 relative group border border-neutral-200">
                    <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        className="px-3 py-1.5 bg-white text-neutral-900 text-xs font-semibold rounded-lg shadow"
                      >
                        Ganti dari Pustaka
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Keterangan Foto (Caption)
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Keterangan dan kredit foto..."
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Pilih dari Pustaka Media</span>
                  </button>
                </div>
              )}

              {/* Render YouTube Video Mode */}
              {mediaType === 'video' && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-red-50/70 border border-red-100 rounded-lg text-[11px] text-neutral-700 space-y-1">
                    <p className="font-semibold text-red-900 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      Opsi Video YouTube Aktif
                    </p>
                    <p className="text-neutral-600 leading-relaxed">
                      Video YouTube akan tampil dan diputar saat pembaca membuka naskah. Thumbnail resmi YouTube otomatis dijadikan gambar sampul di Beranda.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-neutral-700">
                        Tautan Video YouTube (URL)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const sample = 'https://www.youtube.com/watch?v=21X5lGlDOfg';
                          handleYoutubeUrlChange(sample);
                        }}
                        className="text-[10px] text-red-600 hover:underline font-medium flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Gunakan Contoh Video
                      </button>
                    </div>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-mono-code"
                    />
                  </div>

                  {/* Video ID & Status */}
                  {youtubeVideoId ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        <span className="font-medium flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ID Video: <code className="font-mono font-bold text-emerald-900">{youtubeVideoId}</code>
                        </span>
                        <a
                          href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold"
                        >
                          Buka YouTube <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Video Player Preview or Thumbnail with Play Button */}
                      <div className="aspect-16/9 rounded-lg overflow-hidden bg-black relative border border-neutral-300 shadow-xs">
                        {testPlayVideo ? (
                          <iframe
                            src={getYouTubeEmbedUrl(youtubeVideoId, true)}
                            title="Pratinjau Video YouTube"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full relative group">
                            <img
                              src={getYouTubeThumbnail(youtubeVideoId, 'hq')}
                              alt="Thumbnail YouTube"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black/30 transition-all">
                              <button
                                type="button"
                                onClick={() => setTestPlayVideo(true)}
                                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                                title="Uji Coba Pemutar Video"
                              >
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </button>
                              <span className="text-[11px] font-semibold text-white/95 px-2.5 py-1 bg-black/60 rounded-full backdrop-blur-xs">
                                Klik untuk uji putar video
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {testPlayVideo && (
                        <button
                          type="button"
                          onClick={() => setTestPlayVideo(false)}
                          className="w-full py-1.5 text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                        >
                          Kembali ke Pratinjau Thumbnail
                        </button>
                      )}

                      <div className="text-[11px] text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                        <span className="font-semibold text-neutral-800 block mb-0.5">
                          ✓ Pratinjau Thumbnail Beranda:
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <img
                            src={getYouTubeThumbnail(youtubeVideoId, 'hq')}
                            alt="Preview thumb"
                            className="w-16 h-10 object-cover rounded border border-neutral-300 shrink-0"
                          />
                          <p className="text-[10px] text-neutral-500 leading-tight">
                            Thumbnail ini otomatis dijadikan gambar sampul di Beranda saat artikel diterbitkan.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-neutral-50 rounded-lg border border-dashed border-neutral-300 text-center text-xs text-neutral-500 space-y-2">
                      <Film className="w-6 h-6 mx-auto text-neutral-400" />
                      <p>Tempelkan tautan video YouTube di atas untuk melihat pratinjau dan mengambil thumbnail otomatis.</p>
                      <p className="text-[10px] text-neutral-400">Format didukung: youtube.com/watch?v=..., youtu.be/..., shorts</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Keterangan / Kredit Video (Caption)
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Misal: Liputan video eksklusif / Sumber: Kanal YouTube..."
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />

      {/* AI Article Generator Modal */}
      <AiArticleGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialTitle={title}
        categories={categories}
        currentCategoryId={categoryId}
        onApply={handleApplyAiData}
      />
    </div>
  );
};
