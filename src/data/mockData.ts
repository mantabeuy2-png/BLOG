import { Article, Author, Category, Comment, MediaItem, MenuItem, SiteSettings, StaticPage, Tag, User, AdSlot } from '../types';

export const mockCurrentUser: User = {
  id: 'usr-1',
  name: 'Adrian Pratama',
  username: 'adrianpratama',
  email: 'adrian@newsroom.id',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  password: 'Password123!',
  role: 'admin',
  status: 'active',
  createdAt: '2024-01-15'
};

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Adrian Pratama',
    username: 'adrianpratama',
    email: 'adrian@newsroom.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    password: 'Password123!',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 'usr-2',
    name: 'Siti Rahmadani',
    username: 'sitirahma',
    email: 'siti.editor@agenxblog.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    password: 'Redaksi2026!#',
    role: 'editor',
    status: 'active',
    createdAt: '2024-02-10'
  },
  {
    id: 'usr-3',
    name: 'Raditya Wicaksono',
    username: 'radityaw',
    email: 'raditya@newsroom.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    password: 'TechWriter2026$',
    role: 'author',
    status: 'active',
    createdAt: '2024-03-01'
  },
  {
    id: 'usr-4',
    name: 'Budi Santoso',
    username: 'budisantoso',
    email: 'budi.umkm@bisnisindonesia.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    password: 'BisnisMaju2026',
    role: 'subscriber',
    status: 'active',
    createdAt: '2024-05-18'
  },
  {
    id: 'usr-5',
    name: 'Dewi Lestari',
    username: 'dewilestari',
    email: 'dewi.lestari@kreatif.id',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    password: 'PenaKreatif88*',
    role: 'author',
    status: 'inactive',
    createdAt: '2024-06-22'
  }
];

export const mockAuthors: Author[] = [
  {
    id: 'auth-1',
    name: 'Raditya Wicaksono',
    slug: 'raditya-wicaksono',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'Lead Technology Editor',
    bio: 'Jurnalis teknologi yang telah meliput lanskap komputasi kecerdasan buatan, desentralisasi, dan etika algoritma selama lebih dari satu dekade di Asia Tenggara.',
    email: 'raditya@newsroom.id',
    twitter: 'https://twitter.com/radityaw',
    linkedin: 'https://linkedin.com/in/radityaw',
    instagram: 'https://instagram.com/radityaw',
    articleCount: 14
  },
  {
    id: 'auth-2',
    name: 'Dian Prameswari',
    slug: 'dian-prameswari',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    role: 'Senior Business Columnist',
    bio: 'Spesialis makroekonomi, kebijakan moneter, dan restrukturisasi industri modal ventura. Sebelumnya merupakan konsultan riset pasar modal global.',
    email: 'dian@newsroom.id',
    twitter: 'https://twitter.com/dianpram',
    linkedin: 'https://linkedin.com/in/dianpram',
    articleCount: 19
  },
  {
    id: 'auth-3',
    name: 'Arya Seno Aji',
    slug: 'arya-seno-aji',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    role: 'Culture & Urban Essayist',
    bio: 'Menulis tentang relasi antara ruang urban modern, tipografi, antropologi budaya kafe, dan dinamika estetika masyarakat kontemporer.',
    email: 'arya@newsroom.id',
    twitter: 'https://twitter.com/aryaseno',
    instagram: 'https://instagram.com/aryaseno',
    articleCount: 11
  },
  {
    id: 'auth-4',
    name: 'Dr. Maya Hartono',
    slug: 'maya-hartono',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    role: 'Science & Climate Researcher',
    bio: 'Peneliti iklim dan penulis sains independen berfokus pada transisi energi terbarukan, keanekaragaman hayati maritim, dan ketahanan pangan tropis.',
    email: 'maya@newsroom.id',
    linkedin: 'https://linkedin.com/in/mayahartono',
    articleCount: 8
  }
];

export const mockCategories: Category[] = [
  {
    id: 'cat-tech',
    name: 'Teknologi',
    slug: 'teknologi',
    description: 'Investigasi dan perspektif kritis seputar AI, rekayasa perangkat lunak, chip silikon, dan implikasi masa depan digital.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    seoTitle: 'Berita & Analisis Teknologi Terkini | Newsroom',
    seoDescription: 'Liputan mendalam tentang kecerdasan buatan, komputasi awan, dan inovasi sains masa depan.',
    articleCount: 5
  },
  {
    id: 'cat-business',
    name: 'Bisnis',
    slug: 'bisnis',
    description: 'Analisis makroekonomi, modal ventura, disrupsi rantai pasok global, dan strategi korporasi modern.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    seoTitle: 'Wawasan Bisnis & Finansial Global | Newsroom',
    seoDescription: 'Laporan eksklusif pergerakan pasar, investasi teknologi, dan kebijakan moneter.',
    articleCount: 4
  },
  {
    id: 'cat-lifestyle',
    name: 'Gaya Hidup',
    slug: 'gaya-hidup',
    description: 'Eksplorasi desain arsitektur, seni menikmati ruang lambat, gastronomi, dan estetika keseharian.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    seoTitle: 'Gaya Hidup Kontemporer & Desain | Newsroom',
    seoDescription: 'Kurasi gaya hidup bermakna, kebugaran batin, dan keindahan arsitektur kontemporer.',
    articleCount: 3
  },
  {
    id: 'cat-opinion',
    name: 'Opini',
    slug: 'opini',
    description: 'Ruang polemik intelektual, esai kritis, dan gagasan berani dari pemikir lintas disiplin ilmu.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    seoTitle: 'Kolom Opini & Esai Kritis | Newsroom',
    seoDescription: 'Sudut pandang mendalam terhadap isu-isu krusial sosial, politik, dan kebudayaan.',
    articleCount: 3
  },
  {
    id: 'cat-science',
    name: 'Sains',
    slug: 'sains',
    description: 'Eksplorasi batas pengetahuan manusia: astrofisika, genetika terapan, oseanografi, dan energi fusi.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    seoTitle: 'Penemuan Sains & Eksplorasi Alam | Newsroom',
    seoDescription: 'Menyingkap misteri sains modern, astronomi, dan masa depan keberlanjutan bumi.',
    articleCount: 2
  },
  {
    id: 'cat-culture',
    name: 'Budaya',
    slug: 'budaya',
    description: 'Dinamika seni rupa, literatur, perfilman independen, dan warisan budaya yang berevolusi.',
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&auto=format&fit=crop&q=80',
    seoTitle: 'Seni, Sastra, & Budaya Kontemporer | Newsroom',
    seoDescription: 'Ulasan seni, musik, dan fenomena kebudayaan yang membentuk peradaban hari ini.',
    articleCount: 3
  }
];

export const mockTags: Tag[] = [
  { id: 'tag-ai', name: 'Kecerdasan Buatan', slug: 'kecerdasan-buatan', articleCount: 4 },
  { id: 'tag-design', name: 'Desain Editorial', slug: 'desain-editorial', articleCount: 3 },
  { id: 'tag-policy', name: 'Kebijakan Publik', slug: 'kebijakan-publik', articleCount: 2 },
  { id: 'tag-economy', name: 'Ekonomi Digital', slug: 'ekonomi-digital', articleCount: 5 },
  { id: 'tag-climate', name: 'Transisi Energi', slug: 'transisi-energi', articleCount: 2 },
  { id: 'tag-urban', name: 'Urbanisme', slug: 'urbanisme', articleCount: 3 },
  { id: 'tag-work', name: 'Masa Depan Kerja', slug: 'masa-depan-kerja', articleCount: 4 }
];

export const mockMedia: MediaItem[] = [
  {
    id: 'med-1',
    filename: 'quantum-processor-lab.jpg',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '1.4 MB',
    dimensions: '2400 x 1600 px',
    altText: 'Laboratorium riset silikon dan komputasi kuantum berlatar temaram',
    uploadedAt: '2026-09-12',
    caption: 'Ruang bersih perakitan litografi chip mikron di Munich.'
  },
  {
    id: 'med-2',
    filename: 'minimalist-modern-architecture.jpg',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '2.1 MB',
    dimensions: '2800 x 1860 px',
    altText: 'Interior hunian kontemporer bernuansa kayu terang dan bukaan cahaya alami',
    uploadedAt: '2026-09-14',
    caption: 'Desain biofilik yang mempertemukan material mentah dan ritme sirkadian.'
  },
  {
    id: 'med-3',
    filename: 'tokyo-urban-street.jpg',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '1.8 MB',
    dimensions: '2600 x 1730 px',
    altText: 'Jalanan kota modern di waktu senja dengan lampu neon tipis',
    uploadedAt: '2026-09-15',
    caption: 'Evolusi ruang pejalan kaki dalam megapolis abad kedua puluh satu.'
  },
  {
    id: 'med-4',
    filename: 'editorial-writer-desk.jpg',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '1.2 MB',
    dimensions: '2200 x 1460 px',
    altText: 'Meja kerja redaksi minimalis dengan majalah cetak, pena, dan laptop',
    uploadedAt: '2026-09-16',
    caption: 'Ketelitian dalam proses penyuntingan naskah esai panjang.'
  },
  {
    id: 'med-5',
    filename: 'offshore-wind-farm.jpg',
    url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '1.9 MB',
    dimensions: '2700 x 1800 px',
    altText: 'Turbin angin lepas pantai di samudra yang tenang saat matahari terbit',
    uploadedAt: '2026-09-17',
    caption: 'Infrastruktur pembangkit energi bersih di pesisir utara.'
  }
];

export const mockArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Bagaimana Arsitektur Antarmuka Baru Mengubah Cara Kita Berpikir tentang Mesin',
    slug: 'bagaimana-arsitektur-antarmuka-baru-mengubah-cara-kita-berpikir',
    excerpt: 'Pergeseran dari komputasi grafis berbasis klik ke agen generatif multimodal bukan sekadar lompatan teknis, melainkan transformasi mendasar dalam hubungan kognitif manusia dengan alat kerjanya.',
    featuredImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1400&auto=format&fit=crop&q=80',
    imageCaption: 'Ilustrasi konseptual antarmuka kognitif masa depan yang berfokus pada aliran intensi manusia.',
    category: 'Teknologi',
    categoryId: 'cat-tech',
    tags: ['Kecerdasan Buatan', 'Desain Editorial', 'Masa Depan Kerja'],
    author: mockAuthors[0],
    status: 'published',
    publishedAt: '2026-09-18',
    updatedAt: '2026-09-19',
    views: 14820,
    readingTime: '6 menit baca',
    isFeaturedHero: true,
    isTrending: true,
    seoTitle: 'Arsitektur Antarmuka Baru dan Transformasi Kognitif | Newsroom',
    metaDescription: 'Menilik bagaimana model komputasi baru meredefinisi hierarki interaksi manusia dan sistem cerdas dalam dekade mendatang.',
    focusKeyword: 'antarmuka kecerdasan buatan',
    canonicalUrl: 'https://newsroom.id/article/bagaimana-arsitektur-antarmuka-baru-mengubah-cara-kita-berpikir',
    ogImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
    content: `
<p class="dropcap">Dalam tiga dekade terakhir, metafora meja kerja (desktop metaphor)—dengan folder, ikon jendela tumpang tindih, dan kursor penunjuk—telah menjadi bahasa baku bagi hampir seluruh interaksi digital kita. Namun, batas tersebut kini mulai memudar dengan kecepatan yang belum pernah disaksikan sebelumnya.</p>

<p>Ketika model penalaran multimodal semakin mampu mengantisipasi kebutuhan pengguna secara kontekstual, perangkat lunak berhenti berperan sebagai instrumen mekanis statis. Ia berevolusi menjadi mitra dialogis yang mampu menyusun antarmuka sementara (ephemeral interfaces) sesuai dengan tingkat keahlian dan intensi spesifik individu pada detik tersebut.</p>

<h2>Dari Instruksi Deterministik Menuju Intent-Driven Computing</h2>

<p>Secara historis, setiap perangkat lunak mengharuskan pengguna mempelajari tata bahasa visualnya: di mana letak tombol simpan, bagaimana susunan sub-menu dieksekusi, serta apa sintaks parameter yang dapat dipahami sistem. Di era komputasi berbasis intensi, proses adaptasi ini berbalik arah seratus delapan puluh derajat.</p>

<blockquote>
"Kita sedang bergerak dari era di mana manusia harus menguasai logika biner sistem komputer, menuju era di mana komputer diwajibkan memahami nuansa linguistik dan kebiasaan organik manusia."
</blockquote>

<p>Para desainer produk digital kini berhadapan dengan paradoks baru: bagaimana mempertahankan rasa kepemilikan dan kendali (agency) pengguna ketika sistem di balik layar melakukan lompatan inferensi cerdas secara otomatis?</p>

<h3>Tiga Pilar Redesain Antarmuka Generatif</h3>

<p>Berdasarkan pengujian ekstensif di berbagai laboratorium riset produk terkemuka, terdapat tiga fondasi yang menjadi pembeda antarmuka generasi baru:</p>

<ul>
  <li><strong>Transparansi Penalaran:</strong> Menampilkan jejak pemikiran logis (chain of thought) yang dapat diperiksa tanpa membebani muatan kognitif pengguna.</li>
  <li><strong>Kontrol Granular:</strong> Memungkinkan koreksi instan pada parameter mikro tanpa harus mengulang proses perumusan dari awal.</li>
  <li><strong>Keberlanjutan Konteks:</strong> Mengingat preferensi jangka panjang sembari tetap peka terhadap perubahan intensi jangka pendek.</li>
</ul>

<div class="my-8 overflow-hidden rounded-lg border border-neutral-200">
  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80" alt="Eksperimen sirkuit dan visualisasi data interaktif" class="w-full h-80 object-cover" />
  <p class="p-3 text-xs text-neutral-500 bg-neutral-50 border-t border-neutral-200 italic">Eksperimen visualisasi jalur inferensi neural dalam lingkungan pengujian desainer perangkat lunak terintegrasi.</p>
</div>

<h2>Dampak Terhadap Produktivitas dan Kapasitas Mental</h2>

<p>Penelitian empiris terbaru menunjukkan bahwa eliminasi tugas-tugas mekanis repetitif memang mempercepat penyelesaian proyek hingga 40%. Namun, kecepatan ini menimbulkan tantangan baru: kelelahan keputusan (decision fatigue) akibat tingginya volume draf berkualitas tinggi yang dihasilkan secara instan.</p>

<p>Di masa depan, keunggulan profesional tidak lagi ditentukan oleh seberapa cepat seseorang mengoperasikan instrumen piranti lunak, melainkan oleh ketajaman selera kritis (taste), kejelasan artikulasi konseptual, dan keteguhan integritas etis dalam menyeleksi hasil karya.</p>
`
  },
  {
    id: 'art-2',
    title: 'Disrupsi Modal Ventura dan Normalisasi Valuasi Pasca Era Bunga Rendah',
    slug: 'disrupsi-modal-ventura-dan-normalisasi-valuasi',
    excerpt: 'Setelah dekade penuh modal murah, ekosistem teknologi global dipaksa kembali ke hukum gravitasi finansial: margin laba nyata, efisiensi unit ekonomi, dan keberlanjutan arus kas.',
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Gedung-gedung pusat finansial di bawah terpaan fajar dingin.',
    category: 'Bisnis',
    categoryId: 'cat-business',
    tags: ['Ekonomi Digital', 'Kebijakan Publik'],
    author: mockAuthors[1],
    status: 'published',
    publishedAt: '2026-09-17',
    updatedAt: '2026-09-17',
    views: 9240,
    readingTime: '5 menit baca',
    isFeaturedSecondary: true,
    isTrending: true,
    seoTitle: 'Normalisasi Valuasi & Disrupsi Modal Ventura | Newsroom',
    metaDescription: 'Analisis mendalam mengenai bagaimana kebijakan suku bunga sentral mengubah arsitektur pendanaan startup global.',
    content: `
<p class="dropcap">Periode kelimpahan likuiditas yang mendefinisikan dekade 2010-an kini secara resmi telah berganti dengan rezim disiplin fiskal yang ketat. Kenaikan biaya modal telah menyapu bersih metrik-metrik ilusi seperti pertumbuhan pendapatan kotor tanpa batas margin laba.</p>

<p>Bagi para pendiri perusahaan rintisan di Asia Tenggara, pergeseran ini bukan lagi ancaman teoritis, melainkan kenyataan operasional harian yang menentukan hidup dan mati sebuah organisasi bisnis.</p>

<h2>Gravitasi Satuan Ekonomi (Unit Economics)</h2>

<p>Bila lima tahun lalu para investor ventura bersedia menyuntikkan puluhan juta dolar demi merebut pangsa pasar melalui subsidi harga langsung, hari ini kriteria penilaian terpusat pada satu formula sederhana: rasio nilai seumur hidup pelanggan terhadap biaya akuisisi (LTV to CAC) yang teruji dalam siklus ekonomi defensif.</p>
`
  },
  {
    id: 'art-3',
    title: 'Estetika Keheningan: Rekonseptualisasi Ruang Domestik Modern',
    slug: 'estetika-keheningan-rekonseptualisasi-ruang-domestik-modern',
    excerpt: 'Menolak stimulasi sensorik berlebih, gerakan arsitektur residensial terkini mengutamakan material alami yang belum diolah, akustik teredam, dan penataan cahaya sirkadian.',
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Hunian dengan bukaan atrium alami di pinggiran Kyoto.',
    category: 'Gaya Hidup',
    categoryId: 'cat-lifestyle',
    tags: ['Urbanisme', 'Desain Editorial'],
    author: mockAuthors[2],
    status: 'published',
    publishedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    views: 7810,
    readingTime: '4 menit baca',
    isFeaturedSecondary: true,
    seoTitle: 'Estetika Keheningan dalam Arsitektur Rumah Modern | Newsroom',
    metaDescription: 'Eksplorasi arsitektur hunian yang menghadirkan ketenangan batin di tengah riuhnya dunia digital.',
    content: `
<p class="dropcap">Rumah tinggal di era kontemporer bukan lagi sekadar tempat menampung barang-barang konsumsi, melainkan benteng pertahanan psikologis dari derasnya notifikasi dan kelelahan visual dunia luar.</p>

<p>Dengan memadukan kayu hinoki tanpa vernis, plesteran kapur bernapas, dan dinding bersudut lembut yang menangkap bayang-bayang matahari senja, para arsitek menciptakan oase keheningan yang menyembuhkan.</p>
`
  },
  {
    id: 'art-4',
    title: 'Krisis Penyerbukan dan Masa Depan Ketahanan Pangan Tropis',
    slug: 'krisis-penyerbukan-dan-masa-depan-ketahanan-pangan-tropis',
    excerpt: 'Penurunan populasi serangga penyerbuk liar di kawasan khatulistiwa mengancam produktivitas hortikultura bernilai tinggi lebih cepat dari kalkulasi iklim konvensional.',
    featuredImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Lanskap hutan basah tropis tempat jutaan relung ekologis bergantung pada serangga kecil.',
    category: 'Sains',
    categoryId: 'cat-science',
    tags: ['Transisi Energi', 'Kebijakan Publik'],
    author: mockAuthors[3],
    status: 'published',
    publishedAt: '2026-09-15',
    updatedAt: '2026-09-15',
    views: 6420,
    readingTime: '7 menit baca',
    isTrending: true,
    seoTitle: 'Krisis Penyerbuk Tropis & Ketahanan Pangan | Newsroom',
    metaDescription: 'Laporan ilmiah mendalam mengenai penurunan populasi lebah liar dan implikasinya bagi produksi pangan global.',
    content: `
<p class="dropcap">Ketika kita membicarakan krisis iklim global, sorotan publik kerap tertuju pada gletser yang mencair di kutub atau naiknya temperatur permukaan laut. Namun di kanopi hutan tropis Asia, ancaman yang jauh lebih senyap sedang berlangsung: berkurangnya polinator liar.</p>

<p>Lebih dari 75% tanaman pangan utama dunia memerlukan bantuan serangga untuk berbuah optimal. Hilangnya koridor hijau akibat monokultur intensif telah memutus rantai reproduksi alamiah yang telah berjalan selama jutaan tahun.</p>
`
  },
  {
    id: 'art-5',
    title: 'Kritik atas Fetisisme Metrik: Mengapa Angka Merusak Kualitas Jurnalisme',
    slug: 'kritik-atas-fetisisme-metrik-jurnalisme',
    excerpt: 'Obsesi redaksi terhadap analitik klik instan dan durasi sesi mikro telah mengorbankan investigasi panjang berbobot demi umpan sensasi sesaat.',
    featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Mesin ketik manual di samping kopi pahit, simbol perenungan jurnalisme sebelum era metrik klik.',
    category: 'Opini',
    categoryId: 'cat-opinion',
    tags: ['Desain Editorial', 'Kebijakan Publik'],
    author: mockAuthors[2],
    status: 'published',
    publishedAt: '2026-09-14',
    updatedAt: '2026-09-14',
    views: 11300,
    readingTime: '5 menit baca',
    isTrending: true,
    seoTitle: 'Kritik atas Fetisisme Metrik dalam Ruang Redaksi | Newsroom',
    metaDescription: 'Esai kritis mengenai bagaimana algoritma optimasi lalu lintas mereduksi kedalaman intelektual media modern.',
    content: `
<p class="dropcap">Di ruang redaksi abad lalu, kesepakatan editorial lahir dari perdebatan sengit mengenai signifikansi publik, keadilan sosial, dan kejujuran faktual. Hari ini, di banyak kantor media komersial, perdebatan itu digantikan oleh layar monitor raksasa yang menampilkan grafik pergerakan pengunjung detik demi detik.</p>

<p>Ketika angka menjadi satu-satunya dewa yang disembah, naskah investigasi yang memakan waktu tiga bulan riset tersisih oleh artikel daftar sepuluh trik murahan yang diracik dalam dua puluh menit.</p>
`
  },
  {
    id: 'art-6',
    title: 'Kota 15 Menit dan Desentralisasi Kehidupan Urban Kontemporer',
    slug: 'kota-15-menit-dan-desentralisasi-kehidupan-urban',
    excerpt: 'Membongkar hegemoni tata ruang sentralistik: bagaimana kota-kota berkembang di Asia mulai merancang lingkungan mikro yang mandiri secara sosial dan ekologis.',
    featuredImage: 'https://img.youtube.com/vi/21X5lGlDOfg/hqdefault.jpg',
    imageCaption: 'Dokumentasi video lanskap dan tata ruang urban dilihat dari stasiun luar angkasa (NASA ISS 4K).',
    mediaType: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=21X5lGlDOfg',
    youtubeVideoId: '21X5lGlDOfg',
    category: 'Budaya',
    categoryId: 'cat-culture',
    tags: ['Urbanisme', 'Kebijakan Publik'],
    author: mockAuthors[2],
    status: 'published',
    publishedAt: '2026-09-13',
    updatedAt: '2026-09-13',
    views: 5210,
    readingTime: '6 menit baca',
    seoTitle: 'Desentralisasi Kota & Konsep 15 Menit | Newsroom',
    metaDescription: 'Menengok masa depan perencanaan kota yang berpusat pada hak pejalan kaki dan ruang publik terbuka.',
    content: `
<p class="dropcap">Selama hampir seabad, perencana tata kota modern terjebak dalam mitos segregasi fungsional: zona industri di timur, distrik perkantoran di pusat, dan kawasan pemukiman yang terlempar jauh di pinggiran berjarak puluhan kilometer.</p>

<p>Pola ini memaksa jutaan warga menghabiskan dua hingga tiga jam setiap hari terjebak dalam kemacetan bahan bakar fosil yang melelahkan fisik dan mental. Konsep lingkungan swasembada 15 menit mengembalikan martabat waktu hidup manusia ke ruang komunitas terkecilnya.</p>
`
  },
  {
    id: 'art-7',
    title: 'Evolusi Litografi Silikon dan Batasan Fisika Komputasi Modern',
    slug: 'evolusi-litografi-silikon-dan-batasan-fisika-komputasi',
    excerpt: 'Ketika ukuran gerbang transistor mendekati skala atomik, industri semikonduktor menghadapi dinding kuantum tunneling yang menuntut perombakan arsitektur material dasar.',
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Piringan wafer silikon dengan cetakan sirkuit mikroskopis.',
    category: 'Teknologi',
    categoryId: 'cat-tech',
    tags: ['Kecerdasan Buatan', 'Ekonomi Digital'],
    author: mockAuthors[0],
    status: 'published',
    publishedAt: '2026-09-11',
    updatedAt: '2026-09-11',
    views: 8930,
    readingTime: '8 menit baca',
    isTrending: true,
    seoTitle: 'Batas Fisika Silikon & Masa Depan Chip Komputasi | Newsroom',
    metaDescription: 'Analisis teknis litografi ultraviolet ekstrem dan transisi menuju material dua dimensi seperti graphene.',
    content: `
<p class="dropcap">Hukum Moore, dalil empiris yang menyatakan jumlah transistor dalam sirkuit terpadu akan berlipat ganda setiap dua tahun, telah memandu perkembangan peradaban digital selama setengah abad. Namun hari ini, para fisikawan dan insinyur chip berada di ambang batas terdalam mekanika kuantum.</p>

<p>Pada node 2 nanometer, jarak antar transistor begitu rapat sehingga elektron dapat melompat secara spontan melalui efek quantum tunneling, memicu disipasi panas berlebih yang tidak lagi dapat diredam kipas pendingin konvensional.</p>
`
  },
  {
    id: 'art-8',
    title: 'Kemandirian Energi Terbarukan di Gugus Kepulauan Nusantara',
    slug: 'kemandirian-energi-terbarukan-gugus-kepulauan-nusantara',
    excerpt: 'Memanfaatkan potensi arus selat sempit dan mikrohidro terdistribusi untuk menggantikan ketergantungan solar genset di pulau-pulau terpencil.',
    featuredImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Instalasi energi bersih ramah lingkungan di pesisir pulau terluar.',
    category: 'Sains',
    categoryId: 'cat-science',
    tags: ['Transisi Energi', 'Kebijakan Publik'],
    author: mockAuthors[3],
    status: 'published',
    publishedAt: '2026-09-09',
    updatedAt: '2026-09-09',
    views: 4720,
    readingTime: '5 menit baca',
    seoTitle: 'Transisi Energi Terbarukan di Kepulauan Tropis | Newsroom',
    metaDescription: 'Studi kasus implementasi smart microgrid di pulau-pulau terdepan Indonesia.',
    content: `
<p class="dropcap">Bagi negara kepulauan dengan lebih dari tujuh belas ribu pulau, jaringan transmisi listrik raksasa tersentralisasi bukanlah jawaban yang realistis maupun ekonomis. Kunci ketahanan energi masa depan terletak pada kemandirian mikrogrid lokal berbasis surya, angin, dan energi kinetik arus laut.</p>
`
  },
  {
    id: 'art-9',
    title: 'Draf Rencana: Restrukturisasi Etika Algoritma di Institusi Publik',
    slug: 'draf-rencana-restrukturisasi-etika-algoritma',
    excerpt: 'Catatan internal mengenai panduan penyusunan audit model prediktif yang digunakan dalam pelayanan sosial masyarakat sipil.',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    category: 'Teknologi',
    categoryId: 'cat-tech',
    tags: ['Kecerdasan Buatan', 'Kebijakan Publik'],
    author: mockAuthors[0],
    status: 'draft',
    publishedAt: '2026-09-19',
    updatedAt: '2026-09-19',
    views: 0,
    readingTime: '4 menit baca',
    content: '<p>Naskah ini masih dalam tahap penyusunan internal dan peninjauan peer review.</p>'
  }
];

export const mockComments: Comment[] = [
  {
    id: 'com-1',
    articleId: 'art-1',
    articleTitle: 'Bagaimana Arsitektur Antarmuka Baru Mengubah Cara Kita Berpikir tentang Mesin',
    authorName: 'Bambang Sudiro',
    authorEmail: 'bambang.s@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    content: 'Ulasan yang sangat bernas. Poin mengenai "ephemeral interface" benar-benar mencerminkan apa yang sedang kami coba bangun di studio desain kami. Tantangan terbesarnya memang konsistensi memori kognitif pengguna.',
    status: 'approved',
    createdAt: '2026-09-18 14:32'
  },
  {
    id: 'com-2',
    articleId: 'art-1',
    articleTitle: 'Bagaimana Arsitektur Antarmuka Baru Mengubah Cara Kita Berpikir tentang Mesin',
    authorName: 'Siti Rahmawati',
    authorEmail: 'siti.rahma@techindo.or.id',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'Apakah ada studi kasus spesifik tentang bagaimana sistem ini diuji pada pengguna usia non-digital native? Apakah mereka merasa bingung saat antarmuka berubah secara dinamis?',
    status: 'approved',
    createdAt: '2026-09-18 17:15'
  },
  {
    id: 'com-3',
    articleId: 'art-2',
    articleTitle: 'Disrupsi Modal Ventura dan Normalisasi Valuasi Pasca Era Bunga Rendah',
    authorName: 'Ferry Hendrawan',
    authorEmail: 'ferry@venturefund.sg',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    content: 'Sebagai praktisi yang merasakan langsung gelombang koreksi ini, saya sepakat bahwa era bakar uang sudah usang. Laba bersih dan runway 24 bulan kini adalah standar minimum.',
    status: 'approved',
    createdAt: '2026-09-17 19:40'
  },
  {
    id: 'com-4',
    articleId: 'art-5',
    articleTitle: 'Kritik atas Fetisisme Metrik: Mengapa Angka Merusak Kualitas Jurnalisme',
    authorName: 'Promo Murah Judi',
    authorEmail: 'spam99@tempmail.xyz',
    content: 'Kunjungi situs kami sekarang juga dapatkan bonus harian tanpa syarat!',
    status: 'spam',
    createdAt: '2026-09-18 22:01'
  },
  {
    id: 'com-5',
    articleId: 'art-3',
    articleTitle: 'Estetika Keheningan: Rekonseptualisasi Ruang Domestik Modern',
    authorName: 'Taufiq Nugraha',
    authorEmail: 'taufiq.n@arsitektur.id',
    content: 'Pilihan material seperti kayu hinoki dan plester kapur memang terbukti secara ilmiah memperbaiki kualitas udara dan mengurangi dengung frekuensi tinggi.',
    status: 'pending',
    createdAt: '2026-09-19 09:12'
  }
];

export const mockStaticPages: StaticPage[] = [
  {
    id: 'page-about',
    title: 'Tentang Newsroom',
    slug: 'tentang-kami',
    content: `
<h2>Tentang Publikasi Kami</h2>
<p>Newsroom adalah jurnal digital independen yang didedikasikan untuk mempertemukan ketajaman analisis intelektual, ketelitian jurnalisme investigatif, dan keindahan desain editorial modern.</p>
<p>Kami percaya bahwa di era banjir informasi dan kepalsuan sensasional, masyarakat membutuhkan ruang hening di mana gagasan diuji secara mendalam, data diverifikasi dengan integritas ketat, dan bahasa dirawat dengan penuh penghormatan.</p>

<h3>Misi Kami</h3>
<ul>
  <li>Menerbitkan jurnalisme yang memperkaya perspektif publik tanpa terdistorsi oleh insentif klik murahan.</li>
  <li>Menyediakan panggung bagi pemikir independen, peneliti, dan kurator kebudayaan terbaik.</li>
  <li>Membangun teknologi penerbitan sumber terbuka yang cepat, ringan, dan menghormati privasi pembaca.</li>
</ul>
`,
    status: 'published',
    updatedAt: '2026-09-10'
  },
  {
    id: 'page-guidelines',
    title: 'Pedoman Editorial',
    slug: 'pedoman-editorial',
    content: `
<h2>Standar Etika dan Verifikasi Naskah</h2>
<p>Seluruh naskah yang diterbitkan di bawah panji Newsroom tunduk pada kode etik jurnalistik yang ketat dan proses tinjauan fakta (fact-checking) berlapis.</p>
<p>Kami melarang keras plagiarisme, fabrikasi kutipan, serta konflik kepentingan komersial yang tidak diungkapkan secara transparan.</p>
`,
    status: 'published',
    updatedAt: '2026-09-08'
  },
  {
    id: 'page-privacy',
    title: 'Kebijakan Privasi',
    slug: 'kebijakan-privasi',
    content: `
<h2>Komitmen Perlindungan Data</h2>
<p>Newsroom tidak menjual atau menyewakan data pribadi pembaca kepada pihak ketiga mana pun. Kami tidak menggunakan pelacak iklan pihak ketiga yang invasif.</p>
<p>Data analitik yang kami kumpulkan semata-mata bersifat agregat anonim untuk memahami artikel mana yang bermanfaat bagi komunitas pembaca kami.</p>
`,
    status: 'published',
    updatedAt: '2026-09-01'
  },
  {
    id: 'page-contact',
    title: 'Kontak & Ruang Redaksi',
    slug: 'kontak',
    content: `
<h2>Hubungi Dewan Redaksi</h2>
<p>Untuk surat pembaca, usulan liputan investigasi, atau pengajuan naskah esai, silakan hubungi meja redaksi kami di:</p>
<p><strong>Email Redaksi:</strong> redaksi@newsroom.id<br>
<strong>Kemitraan & Lisensi:</strong> partnership@newsroom.id<br>
<strong>Alamat Redaksi:</strong> Jalan Cikini Raya No. 42, Jakarta Pusat 10330</p>
`,
    status: 'published',
    updatedAt: '2026-09-05'
  }
];

export const mockMenuItems: MenuItem[] = [
  { id: 'm-1', label: 'Beranda', type: 'custom', url: '/', order: 1 },
  { id: 'm-2', label: 'Teknologi', type: 'category', url: '/category/teknologi', order: 2 },
  { id: 'm-3', label: 'Bisnis', type: 'category', url: '/category/bisnis', order: 3 },
  { id: 'm-4', label: 'Gaya Hidup', type: 'category', url: '/category/gaya-hidup', order: 4 },
  { id: 'm-5', label: 'Opini', type: 'category', url: '/category/opini', order: 5 },
  { id: 'm-6', label: 'Sains', type: 'category', url: '/category/sains', order: 6 },
  { id: 'm-7', label: 'Budaya', type: 'category', url: '/category/budaya', order: 7 }
];

export const mockSettings: SiteSettings = {
  siteName: 'Newsroom',
  tagline: 'Jurnal Editorial & Publikasi Kontemporer',
  description: 'Platform editorial premium berfokus pada jurnalisme mendalam, analisis teknologi, ekonomi politik, dan estetika budaya.',
  logoText: 'newsroom',
  logoBadge: 'EDITION',
  primaryColor: '#1A1A1A',
  accentColor: '#D9381E', // refined editorial vermilion accent
  facebook: 'https://facebook.com/newsroom',
  twitter: 'https://twitter.com/newsroom',
  instagram: 'https://instagram.com/newsroom',
  linkedin: 'https://linkedin.com/company/newsroom',
  youtube: 'https://youtube.com/@newsroom',
  footerDescription: 'AgenX Blog adalah ruang berbagi insight, strategi, dan teknologi untuk membantu bisnis Indonesia tumbuh di era digital. Dari AI, digital marketing, SEO, website, media sosial, hingga tren teknologi terbaru.',
  copyrightText: '© 2026 Newsroom Media Nusantara. Seluruh hak cipta dilindungi undang-undang.',
  aiProvider: 'google-gemini',
  aiModel: 'gemini-2.5-flash',
  aiDefaultTone: 'Jurnalistik Obyektif & Analitis',
  aiCustomBaseUrl: 'http://localhost:11434/v1',
  aiCustomApiKey: '',
  aiCustomModel: 'llama3:8b',
  aiDetectedModels: ['llama3:8b', 'llama3:70b', 'mistral:latest', 'qwen2.5:7b', 'deepseek-r1:8b']
};

export const mockAds: AdSlot[] = [
  {
    id: 'ad-header',
    title: 'Header Leaderboard Banner',
    position: 'header_banner',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://newsroom.id/subscribe',
    altText: 'Langganan Edisi Digital Newsroom Premium - Akses Tak Terbatas ke Riset & Esai Eksklusif',
    sponsorName: 'Newsroom Premium Fellowship',
    isActive: true,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    impressions: 14280,
    clicks: 642
  },
  {
    id: 'ad-sidebar',
    title: 'Sidebar Rectangle Showcase',
    position: 'sidebar_top',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    targetUrl: 'https://newsroom.id/event/summit-2026',
    altText: 'Asia Pacific Editorial & Future Journalism Summit 2026',
    sponsorName: 'Future Media Forum 2026',
    isActive: true,
    startDate: '2026-09-10',
    endDate: '2026-11-20',
    impressions: 8910,
    clicks: 388
  },
  {
    id: 'ad-in-feed',
    title: 'In-Feed Native Editorial Banner',
    position: 'article_in_feed',
    type: 'sponsored',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://newsroom.id/special-report/clean-energy',
    altText: 'Laporan Khusus Kolaboratif: Transisi Dekarbonisasi dan Ekonomi Sirkular Nusantara',
    sponsorName: 'Inisiatif Energi Lestari Indonesia',
    isActive: true,
    startDate: '2026-09-05',
    endDate: '2026-10-30',
    impressions: 5430,
    clicks: 219
  },
  {
    id: 'ad-bottom',
    title: 'Article Bottom Full Width Banner',
    position: 'article_bottom',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://newsroom.id/podcast',
    altText: 'Dengarkan Podcast Investigasi Newsroom: Suara dari Balik Tirai Ruang Sidang',
    sponsorName: 'Newsroom Audio Network',
    isActive: true,
    startDate: '2026-08-15',
    endDate: '2026-12-31',
    impressions: 11200,
    clicks: 504
  },
  {
    id: 'ad-footer',
    title: 'Dismissable Bottom Floating Bar',
    position: 'footer_banner',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://newsroom.id/archive',
    altText: 'Jelajahi Arsip 10 Tahun Esai Kritis Nusantara — Buka Koleksi Lengkap',
    sponsorName: 'Arsip Jurnalisme Mandiri',
    isActive: false,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    impressions: 3400,
    clicks: 112
  }
];
