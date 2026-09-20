import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Lazy Gemini client helper
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Helper for generating editorial slug
  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Fallback generator when API key is not yet set or during offline fallback
  function generateFallbackArticle(params: {
    title: string;
    targetWords: number;
    tone?: string;
    category?: string;
    additionalNotes?: string;
  }) {
    const title = params.title.trim() || 'Strategi Inovasi Digital dan Ekosistem Bisnis Modern';
    const slug = generateSlug(title);
    const targetWords = params.targetWords || 600;
    const category = params.category || 'Teknologi & Bisnis';

    const excerpt = `Menelusuri dinamika terbaru seputar ${title.toLowerCase()}, artikel ini membedah faktor-faktor strategis, dampak implementasi jangka panjang, dan peta jalan komprehensif bagi para pelaku industri di Indonesia.`;

    const content = `<p class="dropcap">Dalam lanskap transformasi digital yang bergerak sedemikian dinamis, isu mengenai <strong>${title}</strong> menjadi salah satu fokus paling krusial bagi para pemimpin industri, praktisi, dan pengambil kebijakan di seluruh tanah air. Menyadari akselerasi teknologi yang tak lagi mengenal jeda, adopsi pendekatan baru bukan semata pilihan operasional, melainkan imperatif keberlanjutan bisnis.</p>

<h2>Landasan Strategis dan Urgensi Penerapan</h2>
<p>Kajian mendalam terhadap pergerakan pasar modern membuktikan bahwa organisasi yang mampu mengintegrasikan wawasan berbasis data dengan kelincahan eksekusi mencatatkan ketahanan 3,2 kali lebih tinggi menghadapi disrupsi pasar. Fenomena ini tercermin jelas dalam implementasi strategi terpadu yang memadukan automasi cerdas, penguatan kompetensi talenta, serta kepatuhan tata kelola yang kokoh.</p>

<blockquote>"Keberhasilan transformasi di era digital tidak diukur dari seberapa canggih teknologi yang diadopsi, melainkan seberapa tangkas ekosistem merespons perubahan kebutuhan pengguna dan menciptakan nilai nyata berkelanjutan."</blockquote>

<h2>Pilar Kunci Menuju Optimalisasi</h2>
<p>Untuk mencapai dampak maksimal yang dapat diukur, terdapat sejumlah pilar utama yang patut menjadi prioritas manajemen:</p>
<ul>
  <li><strong>Penyelarasan Visi & Budaya:</strong> Mengikis silo internal dan membangun pola pikir eksperimentasi yang terukur.</li>
  <li><strong>Arsitektur Teknologi Terbuka:</strong> Mengadopsi platform modular yang siap diintegrasikan dengan kemajuan kecerdasan buatan dan analitik prediktif.</li>
  <li><strong>Fokus pada Pengalaman Pengguna (UX):</strong> Memastikan setiap sentuhan interaksi menghasilkan efisiensi dan kepuasan pelanggan yang konsisten.</li>
  <li><strong>Keamanan Siber & Kepercayaan Digital:</strong> Menjadikan privasi data sebagai pilar fundamental integritas reputasi merek.</li>
</ul>

<h2>Menavigasi Tantangan dan Mitigasi Risiko</h2>
<p>Setiap peralihan paradigma tentu membawa friksi struktural tersendiri. Kendala umum yang sering dihadapi berkisar pada resistensi perubahan budaya kerja, disparitas keahlian digital, hingga kalkulasi pengembalian investasi (ROI) yang belum terdefinisi secara presisi. Oleh karenanya, pendekatan bertahap berbasis target capaian cepat (quick wins) terbukti lebih efektif memupuk kepercayaan pemangku kepentingan.</p>

<h2>Prospek dan Arah Masa Depan</h2>
<p>Memasuki fase evolusi berikutnya, integrasi antara pemikiran strategis manusia dan kapabilitas kecerdasan buatan akan mendefinisikan ulang batas-batas produktivitas. Para pionir yang berani mengambil langkah terukur hari ini adalah mereka yang akan memimpin kurva pertumbuhan di masa depan.</p>`;

    const seoTitle = `${title.slice(0, 50)} | AgenX`;
    const metaDescription = `Ulasan mendalam mengenai ${title}. Pelajari analisis strategis, tantangan, dan peluang nyata bagi pertumbuhan industri digital Indonesia.`.slice(0, 158);
    const focusKeyword = title.split(' ').slice(0, 3).join(' ').toLowerCase();

    return {
      title,
      slug,
      excerpt,
      content,
      seoTitle,
      metaDescription,
      focusKeyword,
      tags: ['Transformasi Digital', 'Strategi Bisnis', 'Inovasi', category],
      categorySuggestion: category,
      ogTitle: `${title} — Panduan & Analisis Terkini`,
      ogDescription: excerpt,
      wordCount: Math.round(targetWords * 0.95),
      readingTime: `${Math.max(2, Math.round(targetWords / 200))} mnt baca`,
    };
  }

  // API Endpoint: Auto-detect Models from Custom Base URL
  app.post('/api/ai/detect-models', async (req, res) => {
    try {
      const { baseUrl, apiKey } = req.body;
      if (!baseUrl || typeof baseUrl !== 'string' || !baseUrl.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Base URL API wajib diisi untuk mendeteksi model.',
          models: [],
        });
      }

      let cleanBase = baseUrl.trim().replace(/\/+$/, '');
      if (!cleanBase.startsWith('http://') && !cleanBase.startsWith('https://')) {
        cleanBase = 'http://' + cleanBase;
      }

      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (apiKey && typeof apiKey === 'string' && apiKey.trim()) {
        headers['Authorization'] = `Bearer ${apiKey.trim()}`;
      }

      // We test standard candidates:
      // 1. If cleanBase doesn't end with /v1, try /v1/models first (most common for OpenAI router proxies)
      // 2. `${cleanBase}/models`
      // 3. For native Ollama: `${cleanBase}/api/tags`
      const candidateUrls: string[] = [];
      if (!cleanBase.endsWith('/v1')) {
        candidateUrls.push(`${cleanBase}/v1/models`);
        candidateUrls.push(`${cleanBase}/models`);
      } else {
        candidateUrls.push(`${cleanBase}/models`);
        const parentBase = cleanBase.replace(/\/v1$/, '');
        candidateUrls.push(`${parentBase}/api/tags`);
        candidateUrls.push(`${parentBase}/models`);
      }

      let detectedModels: string[] = [];
      let successfulUrl = '';
      let lastError: any = null;

      for (const targetUrl of candidateUrls) {
        try {
          const resp = await fetch(targetUrl, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(7000), // 7 sec timeout
          });

          if (resp.ok) {
            const contentType = resp.headers.get('content-type') || '';
            // If response is HTML (e.g. SPA redirect / login page), skip to next candidate
            if (!contentType.includes('json')) {
              continue;
            }

            const data: any = await resp.json();
            // OpenAI standard: { data: [{ id: "gpt-4o" }, ...] }
            if (Array.isArray(data?.data)) {
              detectedModels = data.data
                .map((m: any) => (typeof m === 'string' ? m : m?.id))
                .filter(Boolean);
            }
            // Ollama /api/tags standard: { models: [{ name: "llama3:8b" }, ...] }
            else if (Array.isArray(data?.models)) {
              detectedModels = data.models
                .map((m: any) => (typeof m === 'string' ? m : m?.name || m?.id))
                .filter(Boolean);
            }
            // Direct array
            else if (Array.isArray(data)) {
              detectedModels = data
                .map((m: any) => (typeof m === 'string' ? m : m?.id || m?.name))
                .filter(Boolean);
            }

            if (detectedModels.length > 0) {
              successfulUrl = targetUrl;
              break;
            }
          } else {
            const errData = await resp.json().catch(() => null);
            if (resp.status === 401 || resp.status === 403) {
              lastError = `Endpoint membutuhkan API Key valid (${errData?.error?.message || `HTTP ${resp.status}`})`;
              // This is a definitive response from the server, so do not keep testing other fallbacks
              break;
            } else {
              lastError = errData?.error?.message || `Status ${resp.status} ${resp.statusText} dari ${targetUrl}`;
            }
          }
        } catch (err: any) {
          lastError = err.message;
        }
      }

      // Sort models alphabetically and unique
      const uniqueModels = Array.from(new Set(detectedModels)).sort();

      if (uniqueModels.length > 0) {
        return res.json({
          success: true,
          models: uniqueModels,
          count: uniqueModels.length,
          endpoint: successfulUrl,
        });
      }

      return res.json({
        success: false,
        error: lastError || 'Tidak ditemukan model pada endpoint Base URL yang diberikan.',
        models: [],
      });
    } catch (err: any) {
      console.error('Error detecting models:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Gagal menghubungi server Base URL.',
        models: [],
      });
    }
  });

  // API Endpoint: AI Article Generator
  app.post('/api/ai/generate-article', async (req, res) => {
    try {
      const {
        title,
        targetWords = 600,
        tone = 'Jurnalistik Obyektif & Analitis',
        category = 'Teknologi',
        additionalNotes = '',
        provider = 'google-gemini',
        model = 'gemini-2.5-flash',
        baseUrl = '',
        apiKey = ''
      } = req.body;

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Judul artikel wajib diisi' });
      }

      // Handler for Custom Provider (OpenAI compatible endpoint)
      if (provider === 'custom' && baseUrl && typeof baseUrl === 'string' && baseUrl.trim()) {
        let cleanBase = baseUrl.trim().replace(/\/+$/, '');
        if (!cleanBase.startsWith('http://') && !cleanBase.startsWith('https://')) {
          cleanBase = 'http://' + cleanBase;
        }

        const candidateChatEndpoints: string[] = [];
        if (cleanBase.endsWith('/chat/completions')) {
          candidateChatEndpoints.push(cleanBase);
        } else if (cleanBase.endsWith('/v1')) {
          candidateChatEndpoints.push(`${cleanBase}/chat/completions`);
        } else {
          candidateChatEndpoints.push(`${cleanBase}/v1/chat/completions`);
          candidateChatEndpoints.push(`${cleanBase}/chat/completions`);
        }

        const customHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };
        if (apiKey && typeof apiKey === 'string' && apiKey.trim()) {
          customHeaders['Authorization'] = `Bearer ${apiKey.trim()}`;
        }

        const chosenModel = model || 'custom';
        const customPrompt = `Anda adalah redaktur senior dan jurnalis profesional berkaliber internasional untuk majalah digital AgenX / Newsroom. Tugas Anda adalah menulis artikel jurnalistik berkualitas tinggi, mendalam, kaya data dan wawasan, serta menyusun slug ramah SEO, kutipan pengantar (excerpt), dan metadata SEO & Social Card (Open Graph).

Informasi Permintaan Redaksi:
- Judul Artikel: "${title.trim()}"
- Target Jumlah Kata: sekitar ${targetWords} kata
- Kategori/Kanal: ${category}
- Gaya Bahasa / Tone: ${tone}
- Mesin / Model: ${chosenModel}
${additionalNotes ? `- Catatan Tambahan Redaksi: ${additionalNotes}` : ''}

Format Output Wajib JSON murni tanpa pembuka/penutup markdown dengan struktur berikut:
{
  "title": "Judul artikel yang disempurnakan atau tetap sesuai input",
  "slug": "slug-url-ramah-seo-huruf-kecil-dan-tanda-strip",
  "excerpt": "Kutipan pengantar editorial 2-3 kalimat",
  "content": "Isi lengkap artikel dalam format HTML editorial dengan panjang sekitar ${targetWords} kata. Wajib gunakan <p class=\\"dropcap\\">...</p> pada paragraf pembuka, sertakan beberapa <h2> subjudul, beberapa paragraf <p>, dan <blockquote>...</blockquote>.",
  "seoTitle": "Judul SEO optimal untuk Google SERP (< 60 karakter)",
  "metaDescription": "Deskripsi meta pencarian Google (140-160 karakter)",
  "focusKeyword": "kata kunci utama pencarian",
  "tags": ["Tag 1", "Tag 2", "Tag 3", "${category}"],
  "categorySuggestion": "${category}",
  "ogTitle": "Judul untuk Social Card",
  "ogDescription": "Deskripsi untuk Social Card",
  "wordCount": ${targetWords},
  "readingTime": "X mnt baca"
}`;

        const chatPayload = {
          model: chosenModel,
          messages: [
            {
              role: 'system',
              content: 'Anda adalah redaktur senior majalah digital AgenX. Balas HANYA dengan JSON valid tanpa teks markdown pengantar apapun.'
            },
            {
              role: 'user',
              content: customPrompt
            }
          ],
          temperature: 0.7,
        };

        for (const chatEndpoint of candidateChatEndpoints) {
          try {
            const customResp = await fetch(chatEndpoint, {
              method: 'POST',
              headers: customHeaders,
              body: JSON.stringify(chatPayload),
              signal: AbortSignal.timeout(45000),
            });

            if (customResp.ok) {
              const contentType = customResp.headers.get('content-type') || '';
              if (!contentType.includes('json')) {
                continue;
              }

              const data: any = await customResp.json();
              const messageContent = data?.choices?.[0]?.message?.content || '';
              const cleanContent = messageContent
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();

              const parsed = JSON.parse(cleanContent);
              return res.json({
                title: parsed.title || title,
                slug: parsed.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                excerpt: parsed.excerpt || '',
                content: parsed.content || '',
                seoTitle: parsed.seoTitle || parsed.title || title,
                metaDescription: parsed.metaDescription || parsed.excerpt || '',
                focusKeyword: parsed.focusKeyword || '',
                tags: Array.isArray(parsed.tags) ? parsed.tags : [category],
                categorySuggestion: parsed.categorySuggestion || category,
                ogTitle: parsed.ogTitle || parsed.seoTitle || title,
                ogDescription: parsed.ogDescription || parsed.metaDescription || '',
                wordCount: parsed.wordCount || targetWords,
                readingTime: parsed.readingTime || `${Math.max(2, Math.round(targetWords / 200))} mnt baca`,
                _generatedBy: `${chosenModel} (Kustom / ${cleanBase})`,
              });
            } else {
              console.warn(`Custom model HTTP error on ${chatEndpoint}: ${customResp.status} ${customResp.statusText}`);
            }
          } catch (customErr: any) {
            console.warn(`Custom provider call to ${chatEndpoint} failed:`, customErr?.message);
          }
        }
      }

      const client = getGeminiClient();

      if (!client) {
        console.warn('GEMINI_API_KEY not found in environment, serving high-grade editorial fallback');
        const fallback = generateFallbackArticle({ title, targetWords, tone, category, additionalNotes });
        return res.json({
          ...fallback,
          _generatedBy: `fallback-template (${provider} / ${model})`,
          _note: 'Silakan atur GEMINI_API_KEY di Settings untuk generasi AI dinamis.',
        });
      }

      const prompt = `Anda adalah redaktur senior dan jurnalis profesional berkaliber internasional untuk majalah digital AgenX / Newsroom. Tugas Anda adalah menulis artikel jurnalistik berkualitas tinggi, mendalam, kaya data dan wawasan, serta menyusun slug ramah SEO, kutipan pengantar (excerpt), dan metadata SEO & Social Card (Open Graph).

Informasi Permintaan Redaksi:
- Judul Artikel: "${title.trim()}"
- Target Jumlah Kata: sekitar ${targetWords} kata
- Kategori/Kanal: ${category}
- Gaya Bahasa / Tone: ${tone}
- Mesin / Model: ${model} (${provider})
${additionalNotes ? `- Catatan Tambahan Redaksi: ${additionalNotes}` : ''}

Format Output Wajib JSON dengan struktur berikut:
{
  "title": "Judul artikel yang disempurnakan atau tetap sesuai input jika sudah kuat",
  "slug": "slug-url-ramah-seo-huruf-kecil-dan-tanda-strip",
  "excerpt": "Kutipan pengantar / lead paragraf editorial sepanjang 2-3 kalimat (30-50 kata) yang memikat pembaca",
  "content": "Isi lengkap artikel dalam format HTML editorial dengan panjang sekitar ${targetWords} kata. Wajib gunakan <p class=\\"dropcap\\">...</p> pada paragraf pembuka, sertakan beberapa <h2> dan <h3> subjudul, beberapa paragraf <p>, setidaknya satu <blockquote>...</blockquote>, dan <ul><li>...</li></ul> jika relevan.",
  "seoTitle": "Judul SEO singkat optimal untuk Google SERP (< 60 karakter)",
  "metaDescription": "Deskripsi meta pencarian Google (140-160 karakter)",
  "focusKeyword": "kata kunci utama pencarian",
  "tags": ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
  "categorySuggestion": "${category}",
  "ogTitle": "Judul untuk Social Card WhatsApp, X, Facebook, LinkedIn",
  "ogDescription": "Deskripsi memikat untuk pratinjau kartu media sosial",
  "wordCount": ${targetWords},
  "readingTime": "X mnt baca"
}

Pastikan bahasa Indonesia yang digunakan baku, cerdas, berkelas editorial tinggi, tidak ada kata klise murahan, dan format HTML valid tanpa markdown backtick di dalam nilai JSON.`;

      // Map models if needed; default to gemini-2.5-flash or gemini-2.5-pro or user specified
      const targetModel = model && typeof model === 'string' && model.trim() ? model.trim() : 'gemini-2.5-flash';

      const response = await client.models.generateContent({
        model: targetModel,
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah redaktur senior majalah digital AgenX. Hasilkan naskah editorial bermutu tinggi, terstruktur rapi, lengkap dengan slug, excerpt, dan metadata SEO & Social Card dalam format JSON murni.',
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text || '';
      let parsedResult;
      try {
        parsedResult = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn('Failed to parse Gemini JSON response directly, cleaning text...', parseErr);
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(cleaned);
      }

      // Ensure minimal fields are filled
      const sanitized = {
        title: parsedResult.title || title,
        slug: parsedResult.slug || generateSlug(parsedResult.title || title),
        excerpt: parsedResult.excerpt || `Analisis komprehensif mengenai ${title}.`,
        content: parsedResult.content || `<p class="dropcap">${parsedResult.excerpt || title}</p>`,
        seoTitle: parsedResult.seoTitle || `${title.slice(0, 55)} | AgenX`,
        metaDescription: parsedResult.metaDescription || parsedResult.excerpt || '',
        focusKeyword: parsedResult.focusKeyword || title.split(' ').slice(0, 3).join(' ').toLowerCase(),
        tags: Array.isArray(parsedResult.tags) ? parsedResult.tags : ['Teknologi', 'Bisnis', 'Inovasi'],
        categorySuggestion: parsedResult.categorySuggestion || category,
        ogTitle: parsedResult.ogTitle || parsedResult.seoTitle || title,
        ogDescription: parsedResult.ogDescription || parsedResult.metaDescription || '',
        wordCount: parsedResult.wordCount || targetWords,
        readingTime: parsedResult.readingTime || `${Math.max(2, Math.round(targetWords / 200))} mnt baca`,
        _generatedBy: `${targetModel} (${provider})`,
      };

      res.json(sanitized);
    } catch (err: any) {
      console.error('Error generating article with Gemini:', err);
      // If Gemini call fails, return our high quality fallback so user workflow is uninterrupted
      const fallback = generateFallbackArticle({
        title: req.body?.title || 'Analisis Transformasi Digital',
        targetWords: req.body?.targetWords || 600,
        tone: req.body?.tone,
        category: req.body?.category,
        additionalNotes: req.body?.additionalNotes,
      });
      res.json({
        ...fallback,
        _generatedBy: 'fallback-on-error',
        _error: err?.message || 'Gemini service encountered an issue; generated draft via editorial template.',
      });
    }
  });

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
